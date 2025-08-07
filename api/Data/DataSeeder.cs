using VCT.API.Models.Clients;
using VCT.API.Models.Products;
using VCT.API.Models.Users;
using VCT.API.Models.Machines;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public static class DataSeeder
    {
        public static async Task SeedDataAsync(ApplicationDBContext context, UserManager<User> userManager)
        {
            // Seed Clients
            if (!context.Clients.Any())
            {
                var clients = new List<Client>
                {
                    new Client { Name = "ASML" },
                    new Client { Name = "Philips" },
                    new Client { Name = "NXP Semiconductors" },
                    new Client { Name = "TSMC" }
                };
                
                context.Clients.AddRange(clients);
                await context.SaveChangesAsync();
            }

            // Seed Products
            if (!context.Products.Any())
            {
                var products = new List<Product>
                {
                    new Product { Name = "Product A",},
                    new Product { Name = "Product B",},
                    new Product { Name = "Product C", },
                    new Product { Name = "Product D", }
                };
                
                context.Products.AddRange(products);
                await context.SaveChangesAsync();
            }

            // Seed Test Users
            if (!await userManager.Users.AnyAsync())
            {
                var testUsers = new List<User>
                {
                    new User { UserName = "admin@vct.com", Email = "admin@vct.com" },
                    new User { UserName = "user1@vct.com", Email = "user1@vct.com" },
                    new User { UserName = "user2@vct.com", Email = "user2@vct.com" }
                };

                foreach (var user in testUsers)
                {
                    await userManager.CreateAsync(user, "TestPassword123!");
                }
            }

            // Seed MasterMachines
            if (!context.MasterMachines.Any())
            {
                var client1 = context.Clients.First(c => c.Name == "ASML");
                var client2 = context.Clients.First(c => c.Name == "Philips");

                var machines = new List<MasterMachine>
                {
                    new MasterMachine { Name = "Machine-001", ClientId = client1.Id },
                    new MasterMachine { Name = "Machine-002", ClientId = client1.Id },
                    new MasterMachine { Name = "Machine-003", ClientId = client2.Id }
                };
                
                context.MasterMachines.AddRange(machines);
                await context.SaveChangesAsync();
            }
        }
    }
}
