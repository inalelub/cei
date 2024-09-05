using System.ComponentModel.DataAnnotations;

namespace vote.Models;

/// <summary>
/// Represents a vote count by a user   
/// </summary>
public class Vote
{
    [Key]
    public int Id { get; set; }
    public int UserId { get; set; } // Foreign key to user
    public int PartyId { get; set; } // Foreign key to party
}