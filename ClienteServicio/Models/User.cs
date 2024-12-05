using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class User
    {
        [Key]
        public string IdUser { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Pass { get; set; }
        public int Active { get; set; }
        public DateTime Created { get; set; }

        public List<UserRole> UserRoles { get; set; }
    }
}
