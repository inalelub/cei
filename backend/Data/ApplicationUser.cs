using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using backend.Models;

namespace backend.Data;

public class ApplicationUser : IdentityUser
{
    [Display(Name = "Identity Number")]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "ID number must be exactly 13 digits")]
    [RegularExpression(@"^\d{13}$", ErrorMessage = "ID number must contain only digits")]
    public required string IdentityNumber { get; set; }

    [MaxLength(128)]
    [Display(Name = "First Name")]
    [RegularExpression(@"^[a-zA-Z\-éèêëÉÈÊË\s]+$", ErrorMessage = "Only letters, hyphens and spaces allowed")]
    public required string FirstName { get; set; }

    [MaxLength(128)]
    [Display(Name = "Last Name")]
    [RegularExpression(@"^[a-zA-Z\-éèêëÉÈÊË\s]+$", ErrorMessage = "Only letters, hyphens and spaces allowed")]
    public required string LastName { get; set; }

    public bool HasVoted { get; set; }

    public virtual Address? Address { get; set; }
    public virtual Vote? Vote { get; set; }
}