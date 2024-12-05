using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class RegisterViewModel
    {

        [Required]
        [StringLength(50)]
        public string UserName {get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(250)]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
