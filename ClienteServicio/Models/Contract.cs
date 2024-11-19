using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class Contract
    {
        [Key]
        public int idsubscription { get; set; } // Clave primaria
        public int idcustomer { get; set; }
        public int idservice { get; set; }
        public DateTime updated { get; set; }
        public int active { get; set; }
    }
}
