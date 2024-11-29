using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClienteServicio.Models
{
    public class Customer
    {
        [Key]
        public int rut { get; set; }
        public string dv { get; set; }
        public string customer { get; set; }

        public string rutdv
        {
            get
            {
                return rut.ToString() + "-" + dv;
            }
        }
    }
}
