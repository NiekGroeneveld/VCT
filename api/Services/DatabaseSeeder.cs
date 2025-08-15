using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(ApplicationDBContext context)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if data already exists to avoid duplicates
            if (await context.Companies.AnyAsync())
            {
                return; // Database has been seeded already
            }

            // Seed Companies
            var companies = new List<Company>
            {
                new Company { Name = "ACME Corp", CreatedAt = DateTime.UtcNow },
                new Company { Name = "TechVision Ltd", CreatedAt = DateTime.UtcNow },
                new Company { Name = "InnovateTech", CreatedAt = DateTime.UtcNow }
            };

            await context.Companies.AddRangeAsync(companies);
            await context.SaveChangesAsync();

            // Seed ConfigurationTypeData (Dynamic Enum Values)
            var configTypes = new List<ConfigurationTypeData>
            {
                new ConfigurationTypeData
                {
                    ConfigurationType = "Standard",
                    MinTrayHeight = 50.0f,
                    TrayWidth = 200.0f,
                    ConfigHeight = 1244.0f,
                    AmountDots = 72,
                    DotsDelta = 13.5f,
                    LowExtractorHeight = 25.0f,
                    LowExtractorDepth = 30.0f,
                    HighExtractorHeight = 50.0f,
                    HighExtractorDepth = 35.0f,
                    PalletDelta = 10.0f
                },
                new ConfigurationTypeData
                {
                    ConfigurationType = "Premium",
                    MinTrayHeight = 75.0f,
                    TrayWidth = 250.0f,
                    ConfigHeight = 1500.0f,
                    AmountDots = 90,
                    DotsDelta = 15.0f,
                    LowExtractorHeight = 30.0f,
                    LowExtractorDepth = 35.0f,
                    HighExtractorHeight = 60.0f,
                    HighExtractorDepth = 40.0f,
                    PalletDelta = 12.0f
                },
                new ConfigurationTypeData
                {
                    ConfigurationType = "Compact",
                    MinTrayHeight = 40.0f,
                    TrayWidth = 150.0f,
                    ConfigHeight = 1000.0f,
                    AmountDots = 60,
                    DotsDelta = 12.0f,
                    LowExtractorHeight = 20.0f,
                    LowExtractorDepth = 25.0f,
                    HighExtractorHeight = 40.0f,
                    HighExtractorDepth = 30.0f,
                    PalletDelta = 8.0f
                }
            };

            await context.ConfigurationTypeData.AddRangeAsync(configTypes);
            await context.SaveChangesAsync();

            // Seed Products
            var products = new List<Product>
            {
                new Product
                {
                    Name = "Widget A",
                    CreatedAt = DateTime.UtcNow,
                    ProductConfig = "CONFIG_A",
                    Height = 25.5f,
                    Width = 15.0f,
                    Depth = 10.0f,
                    Stable = true,
                    ColorHex = "#FF0000", // Red
                    IsActive = true,
                    company = companies[0] // ACME Corp
                },
                new Product
                {
                    Name = "Component B",
                    CreatedAt = DateTime.UtcNow,
                    ProductConfig = "CONFIG_B",
                    Height = 30.0f,
                    Width = 20.0f,
                    Depth = 15.0f,
                    Stable = false,
                    ColorHex = "#00FF00", // Green
                    IsActive = true,
                    company = companies[1] // TechVision Ltd
                },
                new Product
                {
                    Name = "Module C",
                    CreatedAt = DateTime.UtcNow,
                    ProductConfig = "CONFIG_C",
                    Height = 40.0f,
                    Width = 25.0f,
                    Depth = 20.0f,
                    Stable = true,
                    ColorHex = "#0000FF", // Blue
                    IsActive = true,
                    company = companies[2] // InnovateTech
                },
                new Product
                {
                    Name = "Part D",
                    CreatedAt = DateTime.UtcNow,
                    ProductConfig = "CONFIG_D",
                    Height = 15.0f,
                    Width = 12.0f,
                    Depth = 8.0f,
                    Stable = true,
                    ColorHex = "#FFFF00", // Yellow
                    IsActive = true,
                    company = companies[0] // ACME Corp
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();

            // Seed Configurations
            var configurations = new List<Configuration>
            {
                new Configuration
                {
                    Name = "Production Line 1",
                    CreatedAt = DateTime.UtcNow,
                    ConfigurationType = "Standard",
                    ConfigurationTypeData = configTypes[0], // Standard
                    Company = companies[0] // ACME Corp
                },
                new Configuration
                {
                    Name = "Assembly Line A",
                    CreatedAt = DateTime.UtcNow,
                    ConfigurationType = "Premium",
                    ConfigurationTypeData = configTypes[1], // Premium
                    Company = companies[1] // TechVision Ltd
                }
            };

            await context.Configurations.AddRangeAsync(configurations);
            await context.SaveChangesAsync();

            // Seed Trays
            var trays = new List<Tray>
            {
                new Tray
                {
                    TrayConfig = "TRAY_CONFIG_1",
                    TrayPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    Configuration = configurations[0]
                },
                new Tray
                {
                    TrayConfig = "TRAY_CONFIG_2",
                    TrayPosition = 2,
                    CreatedAt = DateTime.UtcNow,
                    Configuration = configurations[0]
                },
                new Tray
                {
                    TrayConfig = "TRAY_CONFIG_3",
                    TrayPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    Configuration = configurations[1]
                }
            };

            await context.Trays.AddRangeAsync(trays);
            await context.SaveChangesAsync();

            // Create Many-to-Many relationships (Products in Trays)
            trays[0].Products.Add(products[0]); // Widget A in Tray 1
            trays[0].Products.Add(products[1]); // Component B in Tray 1
            trays[1].Products.Add(products[2]); // Module C in Tray 2
            trays[2].Products.Add(products[3]); // Part D in Tray 3

            await context.SaveChangesAsync();

            Console.WriteLine("Database seeded successfully!");
        }
    }
}
