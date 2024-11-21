using ClienteServicio.Models;
using Microsoft.EntityFrameworkCore;

namespace ClienteServicio.Data
{
    public class AreaContext : DbContext
    {
        DbContext myDbContext;
        public AreaContext(DbContextOptions<AreaContext> options) : base(options)
        {
            myDbContext = this;
        }

        public DbSet<Area> Areas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Services>()
                .HasOne(s => s.Area) // Relación uno-a-muchos
                .WithMany(a => a.Services) // Colección en `Area`
                .HasForeignKey(s => s.idarea) // Clave foránea explícita
                .HasConstraintName("FK_Services_Area"); // Nombre explícito del constraint (opcional)

            base.OnModelCreating(modelBuilder);
        }
    }

    
}
