using ClienteServicio.Models;
using Microsoft.EntityFrameworkCore;

namespace ClienteServicio.Data
{
    public class CustomerContext : DbContext
    {
        DbContext myDbContext;
        public CustomerContext(DbContextOptions<CustomerContext> options) : base(options)
        {
            myDbContext = this;
        }

        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>()
                .HasKey(c => new { c.rut, c.dv }); // Define la clave primaria compuesta
        }
    }
}
