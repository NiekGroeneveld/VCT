
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using VCT.API.Models.Enums;
using VCT.API.Models.Components;
using VCT.API.Models.Clients;
using VCT.API.Models.Accounts;
using api.Models.ManyToMany;

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

        public DbSet<AccountProduct> AccountProducts { get; set; }
        public DbSet<AccountClient> AccountClients { get; set; }
        public DbSet<ClientProduct> ClientProducts { get; set; }

        public DbSet<MasterMachine> MasterMachines { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<Canal> Canals { get; set; }
        public DbSet<Tray> Trays { get; set; }
        public DbSet<MachineTypeSpecs> MachineTypeSpecs { get; set; }
        


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            //One Single Many-To-Many Relationship (Account-Product)
            modelBuilder.Entity<AccountProduct>()
                .HasKey(ap => new {ap.AccountId, ap.ProductId });

            modelBuilder.Entity<AccountProduct>()
                .HasOne(ap => ap.Account)
                .WithMany(a => a.AccountProducts)
                .HasForeignKey(ap => ap.AccountId);

            modelBuilder.Entity<AccountProduct>()
                .HasOne(ap => ap.Product)
                .WithMany(p => p.AccountProducts)
                .HasForeignKey(ap => ap.ProductId);

            //(Account-Client)
            modelBuilder.Entity<AccountClient>()
                .HasKey(ac => new { ac.AccountId, ac.ClientId });

            modelBuilder.Entity<AccountClient>()
                .HasOne(ac => ac.Account)
                .WithMany(a => a.AccountClients)
                .HasForeignKey(ac => ac.AccountId);

            modelBuilder.Entity<AccountClient>()
                .HasOne(ac => ac.Client)
                .WithMany(c => c.AccountClients)
                .HasForeignKey(ac => ac.ClientId);

            //(Client-Product)
            modelBuilder.Entity<ClientProduct>()
                .HasKey(cp => new { cp.ClientId, cp.ProductId });

            modelBuilder.Entity<ClientProduct>()
                .HasOne(cp => cp.Client)
                .WithMany(c => c.ClientProducts)
                .HasForeignKey(cp => cp.ClientId);

            modelBuilder.Entity<ClientProduct>()
                .HasOne(cp => cp.Product)
                .WithMany(p => p.ClientProducts)
                .HasForeignKey(cp => cp.ProductId);

            modelBuilder.Entity<AccountProduct>().ToTable("AccountProducts");
            modelBuilder.Entity<AccountClient>().ToTable("AccountClients");
            modelBuilder.Entity<ClientProduct>().ToTable("ClientProducts");
            
            //Takes care of enum ExtractorType
            modelBuilder.Entity<Extractor>()
                .HasDiscriminator<string>("ExtractorType")
                .HasValue<HighExtractor>("High")
                .HasValue<LowExtractor>("Low");
        }


    }
}