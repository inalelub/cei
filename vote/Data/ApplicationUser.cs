using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using vote.Models;

namespace vote.Data;

public class ApplicationUser : IdentityUser
{
    [Required]
    [Column(Order = 1)]
    [MaxLength(13, ErrorMessage = "You must enter your 13-digit South African ID number")]
    // [RegularExpression(@"(((\d{2}((0[013578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))", ErrorMessage = "ID Number must be in format yy/mm/dd")]
    public string IdentityNumber { get; set; }
    
    [Required(ErrorMessage = "First name is required. You must enter your first names as they appear on your ID document.")]
    [Column(Order = 2)]
    [MaxLength(128)]
    [RegularExpression("^[a-zA-Z\\\\-éèêëÉÈÊË]+$")]
    public string FirstName { get; set; }
    
    [Required(ErrorMessage = "Last name is required. You must enter your last name as they appear on your ID document.")]
    [Column(Order = 3)]
    [MaxLength(128)]
    [RegularExpression("^[a-zA-Z\\\\-éèêëÉÈÊË]+$")]
    public string LastName { get; set; }
    
    // TODO: Fix how you would implement the Address 
    // [Column(Order = 4)]
    // public Address Address { get; set; }
    
    [Column(Order = 5)]
    public bool HasVoted { get; set; }
    
    // Relationship between ApplicationUser & Vote [One-To-One : Each voter can have only one vote & each vote belongs to exactly one voter]
    
    public virtual Vote? Vote { get; set; }
    
}