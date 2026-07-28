using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace backend.Endpoints;

public static class VotingEndpoints
{
    public static void MapVotingEndpoints(this WebApplication app)
    {
        app.MapGet("/parties", async (ApplicationDbContext db) =>
        {
            var parties = await db.Parties.ToListAsync();
            return Results.Ok(parties);
        });

        app.MapPost("/votes", [Authorize] async (int? partyId, ApplicationDbContext db, ClaimsPrincipal user) =>
        {
            var userEmail = user.Identity?.Name;
            var registeredUser = await db.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (registeredUser is null || partyId is null)
            {
                return Results.NotFound();
            }

            if (registeredUser.HasVoted)
            {
                return Results.Conflict("The user has voted");
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
        });

        app.MapGet("/results", [Authorize] async (ApplicationDbContext db) =>
        {
            var results = await db.Votes.GroupBy(v => v.PartyId).Select(g => new { PartyId = g.Key, VoteCount = g.Count() }).ToListAsync();
            return Results.Ok(results);
        });
    }
}