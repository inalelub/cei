using System.ComponentModel.DataAnnotations;

namespace cei.Models;

/// <summary>
/// Represents a vote count by a user   
/// </summary>
public class Vote
{
    [Key]
    public int Id { get; set; }
    public int UserId { get; set; } // Foreign key to user
    public int PartyId { get; set; } // Foreign key to party
    public int? Total { get; set; }
}