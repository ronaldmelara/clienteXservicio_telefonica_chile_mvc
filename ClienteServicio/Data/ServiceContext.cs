using ClienteServicio.Models;
using Microsoft.EntityFrameworkCore;

namespace ClienteServicio.Data
{
    public class ServiceContext : DbContext
    {
        DbContext myDbContext;
        public ServiceContext(DbContextOptions<ServiceContext> options) : base(options)
        {
            myDbContext = this;
        }

        public DbSet<Services> Services { get; set; }
    }
}
