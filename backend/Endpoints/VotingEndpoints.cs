using System.Security.Claims;
using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Endpoints;

public static class VotingEndpoints
{
    public static void MapVotingEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/voting").RequireAuthorization();

        group.MapGet("/parties", GetParties);
        group.MapGet("/parties/{id:int}", GetPartyById);
        group.MapGet("/status", GetUserStatus);
        group.MapPost("/vote", CastVote);

        group.MapGet("/results", GetResults).AllowAnonymous();
        group.MapGet("/stats", GetVotingStats).AllowAnonymous();
        return;

        static async Task<IResult> GetParties(ApplicationDbContext db)
        {
            var parties = await db.Parties.AsNoTracking().OrderBy(p => p.PartyName).ToListAsync();
            return TypedResults.Ok(parties.Select(ToDto));
        }

        static async Task<IResult> GetPartyById(ApplicationDbContext db, int id, ILogger<ApplicationUser> logger)
        {
            var party = await db.Parties.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

            if (party is null)
            {
                logger.LogWarning("Party {PartyId} not found", id);
                return TypedResults.NotFound();
            }

            return TypedResults.Ok(ToDto(party));
        }

        static async Task<IResult> GetUserStatus(ApplicationDbContext db, ClaimsPrincipal principal, ILogger<ApplicationUser> logger)
        {
            var registeredUser = await FindCurrentUser(db, principal);

            if (registeredUser is null)
            {
                logger.LogWarning("User not found");
                return TypedResults.NotFound();
            }

            return TypedResults.Ok(new UserVotingStatusDto(registeredUser.Id, registeredUser.HasVoted));
        }
        
        static async Task<IResult> CastVote(ApplicationDbContext db, ClaimsPrincipal principal, [FromQuery] int? partyId, ILogger<ApplicationUser> logger)
        {
            var registeredUser = await FindCurrentUser(db, principal);

            if (registeredUser is null)
            {
                logger.LogWarning("User not found");
                return TypedResults.NotFound();
            }

            if (partyId is null || !await db.Parties.AnyAsync(p => p.Id == partyId))
            {
                logger.LogWarning("Vote rejected: party {PartyId} does not exist", partyId);
                return TypedResults.NotFound();
            }

            // Flag the user and store the ballot together, or not at all, so HasVoted always matches the vote count.
            await using var transaction = await db.Database.BeginTransactionAsync();

            // Atomic claim: the database flips HasVoted only if it is still false, so of several simultaneous requests exactly one gets a row back. This is the only duplicate-vote guard, because Vote rows carry no user id.
            var claimed = await db.Users.Where(u => u.Id == registeredUser.Id && !u.HasVoted)
                .ExecuteUpdateAsync(s => s.SetProperty(u => u.HasVoted, true));

            if (claimed == 0)
            {
                logger.LogWarning("Duplicate vote attempt by user {UserId}", registeredUser.Id);
                return TypedResults.Conflict("The user has voted");
            }

            db.Votes.Add(new Vote { PartyId = partyId.Value, CastAt = TruncateToHour(DateTime.UtcNow) });
            await db.SaveChangesAsync();
            await transaction.CommitAsync();

            // No user id here: a timestamped log line naming the voter could be matched to the ballot.
            logger.LogInformation("Vote submitted successfully");
            return TypedResults.Created();
        }
        
        static async Task<IResult> GetResults(ApplicationDbContext db, ILogger<ApplicationUser> logger)
        {
            // Start from Parties so parties with no votes still appear with a count of 0
            var rows = await db.Parties.AsNoTracking().Select(p => new { p.Id, p.PartyName, p.PartyAbbreviation, VoteCount = p.Votes!.Count }).ToListAsync();

            var totalVotes = rows.Sum(r => r.VoteCount);
            var parties = rows.Select(r => new PartyResultDto(r.Id, r.PartyName, r.PartyAbbreviation.ToString(), r.VoteCount, totalVotes == 0 ? 0 : Math.Round(r.VoteCount * 100.0 / totalVotes, 2)))
                .OrderByDescending(r => r.VoteCount)
                .ThenBy(r => r.PartyName)
                .ToList();

            logger.LogInformation("Voting results retrieved");
            return TypedResults.Ok(new VotingResultsDto(totalVotes, parties));
        }

        static async Task<IResult> GetVotingStats(ApplicationDbContext db, ILogger<ApplicationUser> logger)
        {
            var totalVotes = await db.Votes.CountAsync();
            var totalUsers = await db.Users.CountAsync();
            var totalVotedUsers = await db.Users.CountAsync(u => u.HasVoted);
            var turnout = totalUsers == 0 ? 0 : Math.Round(totalVotedUsers * 100.0 / totalUsers, 2);

            logger.LogInformation("Voting statistics retrieved");
            return TypedResults.Ok(new VotingStatsDto(totalVotes, totalUsers, totalVotedUsers, totalUsers - totalVotedUsers, turnout));
        }

        // Look the user up by their id claim; Identity.Name is the UserName, which is not always the email.
        static Task<ApplicationUser?> FindCurrentUser(ApplicationDbContext db, ClaimsPrincipal principal)
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            return userId is null ? Task.FromResult<ApplicationUser?>(null) : db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }

        static PartyDto ToDto(Party p) => new(p.Id, p.PartyName, p.PartyAbbreviation.ToString(), p.PartyUrl, p.LogoUrl);
        
        static DateTime TruncateToHour(DateTime value) => new(value.Year, value.Month, value.Day, value.Hour, 0, 0, value.Kind);
    }
}
