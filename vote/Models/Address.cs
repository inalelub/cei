using System.ComponentModel.DataAnnotations;

namespace vote.Models;

/// <summary>
/// Represents the full address of the user
/// </summary>
public class Address
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Street { get; set; }
    [Required]
    [MaxLength(256)]
    public string City { get; set; }
    [Required]
    public Provinces Provinces { get; set; }
    [Required]
    public int ZipCode  { get; set; }
}