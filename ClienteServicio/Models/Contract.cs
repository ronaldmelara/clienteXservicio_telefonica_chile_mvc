using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class Contract
    {
        [Key]
        public int idcontract { get; set; } // Clave primaria
        public int rut { get; set; }
        public int idservice { get; set; }
        public DateTime updated { get; set; }
        public int active { get; set; }
        public string dv {  get; set; }
    }
}
