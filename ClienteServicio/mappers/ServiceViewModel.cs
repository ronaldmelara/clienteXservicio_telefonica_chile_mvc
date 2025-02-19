using ClienteServicio.Models;

namespace ClienteServicio.mappers
{
    public class ServiceViewModel
    {
        public int idservice { get; set; }
        public string service { get; set; }
        public int idarea { get; set; }

        // Propiedad de navegación hacia Area
        public AreaViewModel Area { get; set; }

        public int enable { get; set; }
    }
}
