using System.ComponentModel.DataAnnotations;
using vote.Data;

namespace vote.Models;

/// <summary>
/// Represents a vote count by a user   
/// </summary>
public class Vote
{
    [Key]
    public int Id { get; set; }
    
    // Relationship between ApplicationUser & Vote [One-To-One : Each voter can have only one vote & each vote belongs to exactly one voter]
    
    public int? ApplicationUserId { get; set; } // optional foreign key property
    public virtual ApplicationUser? ApplicationUser { get; set; } // optional reference navigation to principal
    
    // Relationship between Party & Vote [One-To-Many : One party can receive many votes but each vote is cast for exactly one party]
    
    public int? PartyId { get; set; }
    public virtual Party? Party { get; set; }
    
}