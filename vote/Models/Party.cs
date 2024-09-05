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
    [Column(Order = 2)]
    public string PartyName { get; set; }
    [Required]
    [Column(Order = 3)]
    public Parties PartyAbbreviation { get; set; }
    [Column(Order = 4)]
    public string? PartyUrl { get; set; }
}