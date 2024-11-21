using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class Area
    {
        [Key]
        public int idarea { get; set; }
        public string area { get; set; }

        // Propiedad de navegación inversa para los servicios asociados
        public ICollection<Services> Services { get; set; }
    }
}
 