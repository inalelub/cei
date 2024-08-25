using System.ComponentModel.DataAnnotations;

namespace cei.Models;

/// <summary>
/// Represents the parties that the user will vote for
/// </summary>
public class Party
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string PartyName { get; set; }
    [Required]
    public Parties PartyAbbreviation { get; set; }
    public string? PartyUrl { get; set; }
}