using System.ComponentModel.DataAnnotations;

namespace backend.Models;

/// <summary>
/// An anonymous ballot. It records which party received the vote, but not who cast it;
/// whether a user has voted is tracked separately by <see cref="backend.Data.ApplicationUser.HasVoted"/>.
/// </summary>
public class Vote
{
    [Key]
    public int Id { get; set; }

    // When the vote was cast (UTC), rounded down to the hour so it can't be matched to a voter by timing
    public DateTime CastAt { get; set; }

    // Relationship between Party & Vote [One-To-Many : One party can receive many votes but each vote is cast for exactly one party]
    public int? PartyId { get; set; }
    public virtual Party? Party { get; set; }
}
