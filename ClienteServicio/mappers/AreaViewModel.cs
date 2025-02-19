using ClienteServicio.Models;

namespace ClienteServicio.mappers
{
    public class AreaViewModel
    {
        public int idarea { get; set; }
        public string area { get; set; }

        // Propiedad de navegación inversa para los servicios asociados
        public ICollection<Services> Services { get; set; }
    }
}
