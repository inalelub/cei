namespace backend.Models.DTOs;

public class RegisterDto
{
    public required string Email { get; set; }
    public string? UserName { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string IdentityNumber { get; set; }
    public string? PhoneNumber { get; set; }
    public required string Password { get; set; }    
    public Address? Address { get; set; }
}