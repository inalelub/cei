using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using backend.Models;

namespace backend.Data;

public sealed class ApplicationUser : IdentityUser
{
    // YYMMDD (valid month/day) + SSSS (gender) + C (citizenship: 0 or 1) + A + Z
    public const string IdentityNumberPattern = @"^\d{2}(?:(?:0[13578]|1[02])(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)(?:0[1-9]|[12]\d|30)|02(?:0[1-9]|[12]\d))\d{4}[01]\d{2}$";

    [RegularExpression(IdentityNumberPattern, ErrorMessage = "ID number must be 13 digits and start with a valid birth date (YYMMDD)")]
    public string IdentityNumber { get; set; }

    [RegularExpression(@"^[a-zA-Z\-éèêëÉÈÊË\s]+$", ErrorMessage = "Only letters, hyphens and spaces allowed")]
    public string FirstName { get; set; }

    [RegularExpression(@"^[a-zA-Z\-éèêëÉÈÊË\s]+$", ErrorMessage = "Only letters, hyphens and spaces allowed")]
    public string LastName { get; set; }

    public bool HasVoted { get; set; }

    public Address? Address { get; set; }
    public Vote? Vote { get; set; }
}