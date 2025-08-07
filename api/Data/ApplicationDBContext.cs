
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using VCT.API.Models.Components;
using VCT.API.Models.Clients;
using VCT.API.Models.Users;
using api.Models.ManyToMany;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<User>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions) 
            : base(dbContextOptions)
        {

        }

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
            base.OnModelCreating(modelBuilder);
            
            //One Single Many-To-Many Relationship (User-Product)
            //(User-Client)
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

            modelBuilder.Entity<ClientProduct>().ToTable("ClientProducts");

            // UserProduct many-to-many relationship
            modelBuilder.Entity<UserProduct>()
                .HasKey(up => new { up.UserId, up.ProductId });

            modelBuilder.Entity<UserProduct>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserProducts)
                .HasForeignKey(up => up.UserId);

            modelBuilder.Entity<UserProduct>()
                .HasOne(up => up.Product)
                .WithMany(p => p.UserProducts)
                .HasForeignKey(up => up.ProductId);

            modelBuilder.Entity<UserProduct>().ToTable("UserProducts");

            // UserClient many-to-many relationship
            modelBuilder.Entity<UserClient>()
                .HasKey(uc => new { uc.UserId, uc.ClientId });

            modelBuilder.Entity<UserClient>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserClients)
                .HasForeignKey(uc => uc.UserId);

            modelBuilder.Entity<UserClient>()
                .HasOne(uc => uc.Client)
                .WithMany(c => c.UserClients)
                .HasForeignKey(uc => uc.ClientId);

            modelBuilder.Entity<UserClient>().ToTable("UserClients");
            
            //Takes care of enum ExtractorType
            modelBuilder.Entity<Extractor>()
                .HasDiscriminator<string>("ExtractorType")
                .HasValue<HighExtractor>("High")
                .HasValue<LowExtractor>("Low");
        }


    }
}