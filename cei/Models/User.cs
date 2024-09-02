using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cei.Models;

/// <summary>
/// Represents the user who will be voting
/// </summary>
public class User
{
    [Key]
    public int Id { get; set; }
    [Required(ErrorMessage = "First name is required. You must enter your first names as they appear on your ID document.")]
    [Column(Order = 2)]
    public string FirstName { get; set; }
    [Required(ErrorMessage = "Last name is required. You must enter your last name as they appear on your ID document.")]
    [Column(Order = 3)]
    public string LastName { get; set; }
    [Required]
    [MaxLength(13, ErrorMessage = "You must enter your 13-digit South African ID number")]
    [Column(Order = 2)]
    public int IdentityNumber { get; set; }
    [Required]
    [MaxLength(10, ErrorMessage = "Cellphone number should contain 10 characters")]
    public int CellphoneNumber { get; set; }
    [Required]
    [Column(Order = 4)]
    public Address Address { get; set; }
    [Required]
    public Role Role { get; set; }
}