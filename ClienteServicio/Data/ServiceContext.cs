﻿using ClienteServicio.Models;
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
        public DbSet<Area> Areas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Services>()
                .HasOne(s => s.Area)
                .WithMany(a => a.Services)
                .HasForeignKey(s => s.idarea);

            base.OnModelCreating(modelBuilder);
        }
    }
}
