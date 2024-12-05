namespace ClienteServicio.Models
{
    public class UserRole
    {
        public string IdUser { get; set; }
        public int IdRol { get; set; }

        public User User { get; set; }
        public Role Role { get; set; }
    }
}
