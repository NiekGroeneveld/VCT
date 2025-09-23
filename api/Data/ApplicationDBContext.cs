using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }


        public DbSet<Company> Companies { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Tray> Trays { get; set; }
        public DbSet<TrayProduct> TrayProducts { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<ConfigurationTypeData> ConfigurationTypeData { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Company-AppUser many-to-many relationship
            modelBuilder.Entity<Company>()
                .HasMany(c => c.Users)
                .WithMany(u => u.Companies);

            // Configure TrayProduct many-to-many with position
            modelBuilder.Entity<TrayProduct>()
                .HasKey(tp => tp.Id); // Surrogate primary key
            
            modelBuilder.Entity<TrayProduct>().Property(tp => tp.Id).ValueGeneratedOnAdd();
            // Keep a non-unique index for performance but allow flexible reordering at the app level
            modelBuilder.Entity<TrayProduct>()
                .HasIndex(tp => new { tp.TrayId, tp.OnTrayIndex });

            modelBuilder.Entity<TrayProduct>()
                .HasOne(tp => tp.Tray)
                .WithMany(t => t.TrayProducts)
                .HasForeignKey(tp => tp.TrayId);

            modelBuilder.Entity<TrayProduct>()
                .HasOne(tp => tp.Product)
                .WithMany(p => p.TrayProducts)
                .HasForeignKey(tp => tp.ProductId);

            // Ensure position is between 1 and 10
            modelBuilder.Entity<TrayProduct>()
                .Property(tp => tp.OnTrayIndex)
                .IsRequired();

            base.OnModelCreating(modelBuilder);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "User",
                    NormalizedName = "USER"
                }
            };

            modelBuilder.Entity<IdentityRole>().HasData(roles);
        }
    }
}