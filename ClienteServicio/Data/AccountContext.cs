using ClienteServicio.Models;
using Microsoft.EntityFrameworkCore;

namespace ClienteServicio.Data
{
    public class AccountContext : DbContext
    {
        DbContext myDbContext;
        public AccountContext(DbContextOptions<AccountContext> options) : base(options)
        {
            myDbContext = this;
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.IdUser, ur.IdRol });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.IdUser);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany()
                .HasForeignKey(ur => ur.IdRol);
        }

    }
}
