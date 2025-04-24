
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using VCT.API.Models.Enums;
using VCT.API.Models.Components;
using VCT.API.Models.Clients;
using VCT.API.Models.SpecificationData;
using VCT.API.Models.Accounts;

namespace api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<MasterMachine> MasterMachines { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<Canal> Canals { get; set; }
        public DbSet<Tray> Trays { get; set; }
        


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Extractor>()
                .HasDiscriminator<string>("ExtractorType")
                .HasValue<HighExtractor>("High")
                .HasValue<LowExtractor>("Low");
        }


    }
}