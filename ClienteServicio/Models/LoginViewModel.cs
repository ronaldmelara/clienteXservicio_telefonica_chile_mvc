using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class LoginViewModel
    {
        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
    }
}
