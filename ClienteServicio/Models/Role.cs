using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class Role
    {
        [Key]
        public int IdRol { get; set; }
        public string Rol { get; set; }
    }
}
