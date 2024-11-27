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
    }
}
