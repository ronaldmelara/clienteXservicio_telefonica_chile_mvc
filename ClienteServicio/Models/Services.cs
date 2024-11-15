using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class Services
    {
        [Key]
        public int idservice { get; set; }
        public string service { get; set; }
        public int idarea { get; set; }
    }
}
