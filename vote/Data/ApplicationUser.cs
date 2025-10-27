using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using vote.Models;

namespace vote.Data;

public class ApplicationUser : IdentityUser
{
    [Required]
    [Display(Name = "Identity Number")]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "ID number must be exactly 13 digits")]
    [RegularExpression(@"^\d{13}$", ErrorMessage = "ID number must contain only digits")]
    public string IdentityNumber { get; set; }

    [Required(ErrorMessage =
        "Last name is required. You must enter your first name as they appear on your ID document.")]
    [MaxLength(128)]
    [Display(Name = "First Name")]
    [RegularExpression(@"^[a-zA-Z\-éèêëÉÈÊË\s]+$", ErrorMessage = "Only letters, hyphens and spaces allowed")]
    public string FirstName { get; set; }

    [Required(ErrorMessage =
        "Last name is required. You must enter your last name as they appear on your ID document.")]
    [MaxLength(128)]
    [Display(Name = "Last Name")]
    [RegularExpression(@"^[a-zA-Z\-éèêëÉÈÊË\s]+$", ErrorMessage = "Only letters, hyphens and spaces allowed")]
    public string LastName { get; set; }

    public bool HasVoted { get; set; }

    public virtual Address? Address { get; set; }
    public virtual Vote? Vote { get; set; }
}