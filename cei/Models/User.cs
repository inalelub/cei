using System.ComponentModel.DataAnnotations;

namespace cei.Models;

/// <summary>
/// Represents the user who will be voting
/// </summary>
public class User
{
    [Key]
    public int Id { get; set; }
    [Required(ErrorMessage = "First name is required. You must enter your first names as they appear on your ID document.")]
    public string FirstName { get; set; }
    [Required(ErrorMessage = "Last name is required. You must enter your last name as they appear on your ID document.")]
    public string LastName { get; set; }
    [Required]
    [Length(minimumLength: 13, maximumLength:13, ErrorMessage = "You must enter your 13-digit South African ID number")]
    public int IdentityNumber { get; set; }
    [Required]
    [Length(minimumLength: 10, maximumLength:10, ErrorMessage = "Cellphone number should contain 10 characters")]
    public int CellphoneNumber { get; set; }
    public Address Address { get; set; }
}