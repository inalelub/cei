using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Endpoints;

public static class VotingEndpoints
{
    public static void MapVotingEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/voting").RequireAuthorization();

        group.MapGet("/parties", GetAllParties);
        group.MapPost("/votes", NewVote);
        group.MapGet("/results", GetVotingResults);

        static async Task<IResult> GetAllParties(ApplicationDbContext db)
        {
            var parties = await db.Parties.ToListAsync();
            return TypedResults.Ok(parties);
        }

        static async Task<IResult> NewVote(ApplicationDbContext db, ClaimsPrincipal user, [FromQuery] int? partyId)
        {
            var userEmail = user.Identity?.Name;
            var registeredUser = await db.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (registeredUser is null || partyId is null)
            {
                return TypedResults.NotFound();
            }

            if (registeredUser.HasVoted)
            {
                return TypedResults.Conflict("The user has voted");
            }

            var newVote = new Vote
            {
                ApplicationUserId = registeredUser.Id,
                PartyId = partyId.Value
            };

            db.Votes.Add(newVote);
            registeredUser.HasVoted = true;

            await db.SaveChangesAsync();
            return Results.Created();           
        }
        
        static async Task<IResult> GetVotingResults(ApplicationDbContext db)
        {
            var results = await db.Votes.GroupBy(v => v.PartyId)
                .Select(g => new { PartyId = g.Key, VoteCount = g.Count() }).ToListAsync();
            return TypedResults.Ok(results);
        }
    }
}