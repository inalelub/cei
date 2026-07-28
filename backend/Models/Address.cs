using System.ComponentModel.DataAnnotations;
using backend.Data;
using backend.Models.Enums;

namespace backend.Models;

/// <summary>
/// Represents the full address of the user
/// </summary>
public class Address
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Street address is required")]
    public required string Street { get; set; }

    [Required(ErrorMessage = "Suburb is required")]
    public required string Suburb { get; set; }

    [Required(ErrorMessage = "City is required")]
    public required string City { get; set; }

    [Required(ErrorMessage = "Province is required")]
    public required Provinces Province { get; set; }

    [Required(ErrorMessage = "Postal code is required")]
    [RegularExpression(@"^\d{4}$", ErrorMessage = "Postal code must be 4 digits")]
    public required string ZipCode  { get; set; }

    // Relationship between ApplicationUser & Address [One-To-One : Each voter can have only one address & each address belongs to exactly one voter]
    public string? ApplicationUserId { get; set; } 
    public virtual ApplicationUser? ApplicationUser { get; set; } 
}