using System.ComponentModel.DataAnnotations;

namespace ClienteServicio.Models
{
    public class Customer
    {
        [Key]
        public int idcustomer { get; set; }
        public string customer { get; set; }
    }
}
