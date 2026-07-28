using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.Enums;

namespace backend.Models;

/// <summary>
/// Represents the parties that the user will vote for
/// </summary>
public class Party
{
    [Key]
    public int Id { get; set; }
    
    public required string PartyName { get; set; }
    
    public required Parties PartyAbbreviation { get; set; }
    
    [Column(Order = 3)]
    public string? PartyUrl { get; set; }

    [Column(Order = 4)]
    public string? LogoUrl { get; set; }
    
    // Relationship between Party & Vote [One-To-Many : One party can receive many votes but each vote is cast for exactly one party]
    public virtual ICollection<Vote>? Votes { get; set; } = new List<Vote>(); // Collection navigation
}