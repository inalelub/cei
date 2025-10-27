using System.ComponentModel.DataAnnotations;
using vote.Data;

namespace vote.Models;

/// <summary>
/// Represents the full address of the user
/// </summary>
public class Address
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Street address is required")]
    [MaxLength(256)]
    [Display(Name = "Street Address")]
    public string Street { get; set; }

    [Required(ErrorMessage = "Suburb is required")]
    [MaxLength(128)]
    public string Suburb { get; set; }

    [Required(ErrorMessage = "City is required")]
    [MaxLength(128)]
    public string City { get; set; }

    [Required(ErrorMessage = "Province is required")]
    public Provinces Province { get; set; }

    [Required(ErrorMessage = "Postal code is required")]
    [StringLength(4, MinimumLength = 4, ErrorMessage = "Postal code must be 4 digits")]
    [RegularExpression(@"^\d{4}$", ErrorMessage = "Postal code must be 4 digits")]
    [Display(Name = "Postal Code")]
    public string ZipCode  { get; set; }

    // Relationship between ApplicationUser & Address [One-To-One : Each voter can have only one address & each address belongs to exactly one voter]
    public string? ApplicationUserId { get; set; } 
    public virtual ApplicationUser? ApplicationUser { get; set; } 
}