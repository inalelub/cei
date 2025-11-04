using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace vote.Models;

/// <summary>
/// Represents the parties that the user will vote for
/// </summary>
public class Party
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(Order = 1)]
    [MaxLength(256)]
    public string PartyName { get; set; }
    
    [Required]
    [Column(Order = 2)]
    [MaxLength(50)]
    public Parties PartyAbbreviation { get; set; }
    
    // TODO: Fix some of the URLS
    [Column(Order = 3)]
    public string? PartyUrl { get; set; }

    // TODO: Implement a logo url for parties that means a new property
    
    // Relationship between Party & Vote [One-To-Many : One party can receive many votes but each vote is cast for exactly one party]
   
    public virtual ICollection<Vote>? Votes { get; set; } = new List<Vote>(); // Collection navigation
}