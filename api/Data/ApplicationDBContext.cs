
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using VCT.API.Models.Enums;
using VCT.API.Models.Components;
using VCT.API.Models.Clients;
using VCT.API.Models.Users;
using api.Models.ManyToMany;

namespace api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Product> Products { get; set; }

        public DbSet<UserProduct> UserProducts { get; set; }
        public DbSet<UserClient> UserClients { get; set; }
        public DbSet<ClientProduct> ClientProducts { get; set; }

        public DbSet<MasterMachine> MasterMachines { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<Canal> Canals { get; set; }
        public DbSet<Tray> Trays { get; set; }
        public DbSet<MachineTypeSpecs> MachineTypeSpecs { get; set; }
        


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            //One Single Many-To-Many Relationship (User-Product)
            modelBuilder.Entity<UserProduct>()
                .HasKey(ap => new {ap.UserId, ap.ProductId });

            modelBuilder.Entity<UserProduct>()
                .HasOne(ap => ap.User)
                .WithMany(a => a.UserProducts)
                .HasForeignKey(ap => ap.UserId);

            modelBuilder.Entity<UserProduct>()
                .HasOne(ap => ap.Product)
                .WithMany(p => p.UserProducts)
                .HasForeignKey(ap => ap.ProductId);

            //(User-Client)
            modelBuilder.Entity<UserClient>()
                .HasKey(ac => new { ac.UserId, ac.ClientId });

            modelBuilder.Entity<UserClient>()
                .HasOne(ac => ac.User)
                .WithMany(a => a.UserClients)
                .HasForeignKey(ac => ac.UserId);

            modelBuilder.Entity<UserClient>()
                .HasOne(ac => ac.Client)
                .WithMany(c => c.UserClients)
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

            modelBuilder.Entity<UserProduct>().ToTable("UserProducts");
            modelBuilder.Entity<UserClient>().ToTable("UserClients");
            modelBuilder.Entity<ClientProduct>().ToTable("ClientProducts");
            
            //Takes care of enum ExtractorType
            modelBuilder.Entity<Extractor>()
                .HasDiscriminator<string>("ExtractorType")
                .HasValue<HighExtractor>("High")
                .HasValue<LowExtractor>("Low");
        }


    }
}