using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using backend.Models;

namespace backend.Data;

public sealed class ApplicationUser : IdentityUser
{
    [StringLength(13, MinimumLength = 13, ErrorMessage = "ID number must be exactly 13 digits")]
    [RegularExpression(@"^\d{13}$", ErrorMessage = "ID number must contain only digits")]
    public string IdentityNumber { get; set; }

    [RegularExpression(@"^[a-zA-Z\-éèêëÉÈÊË\s]+$", ErrorMessage = "Only letters, hyphens and spaces allowed")]
    public string FirstName { get; set; }

    [RegularExpression(@"^[a-zA-Z\-éèêëÉÈÊË\s]+$", ErrorMessage = "Only letters, hyphens and spaces allowed")]
    public string LastName { get; set; }

    public bool HasVoted { get; set; }

    public Address? Address { get; set; }
    public Vote? Vote { get; set; }
}