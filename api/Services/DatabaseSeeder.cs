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
                },
                new ConfigurationTypeData
                {
                    ConfigurationType = "VisionV8",
                    MinTrayHeight = 60.0f,
                    TrayWidth = 220.0f,
                    ConfigHeight = 1350.0f,
                    AmountDots = 80,
                    DotsDelta = 14.0f,
                    LowExtractorHeight = 28.0f,
                    LowExtractorDepth = 32.0f,
                    HighExtractorHeight = 55.0f,
                    HighExtractorDepth = 38.0f,
                    PalletDelta = 11.0f
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
                    CompanyId = companies[0].Id, // ACME Corp
                    Company = companies[0]
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
                    CompanyId = companies[1].Id, // TechVision Ltd
                    Company = companies[1]
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
                    CompanyId = companies[2].Id, // InnovateTech
                    Company = companies[2]
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
                    CompanyId = companies[0].Id, // ACME Corp
                    Company = companies[0]
                },
                new Product
                {
                    Name = "Sensor E",
                    CreatedAt = DateTime.UtcNow,
                    ProductConfig = "CONFIG_E",
                    Height = 35.0f,
                    Width = 18.0f,
                    Depth = 12.0f,
                    Stable = true,
                    ColorHex = "#FF00FF", // Magenta
                    IsActive = true,
                    CompanyId = companies[1].Id, // TechVision Ltd
                    Company = companies[1]
                },
                new Product
                {
                    Name = "Actuator F",
                    CreatedAt = DateTime.UtcNow,
                    ProductConfig = "CONFIG_F",
                    Height = 50.0f,
                    Width = 30.0f,
                    Depth = 25.0f,
                    Stable = false,
                    ColorHex = "#00FFFF", // Cyan
                    IsActive = true,
                    CompanyId = companies[2].Id, // InnovateTech
                    Company = companies[2]
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
                    UpdatedAt = DateTime.UtcNow,
                    ConfigurationType = "Standard",
                    ConfigurationTypeData = configTypes[0], // Standard
                    CompanyId = companies[0].Id,
                    Company = companies[0] // ACME Corp
                },
                new Configuration
                {
                    Name = "Assembly Line A",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ConfigurationType = "Premium",
                    ConfigurationTypeData = configTypes[1], // Premium
                    CompanyId = companies[1].Id,
                    Company = companies[1] // TechVision Ltd
                },
                new Configuration
                {
                    Name = "Quality Control Station",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ConfigurationType = "Compact",
                    ConfigurationTypeData = configTypes[2], // Compact
                    CompanyId = companies[2].Id,
                    Company = companies[2] // InnovateTech
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
                    UpdatedAt = DateTime.UtcNow,
                    Configuration = configurations[0]
                },
                new Tray
                {
                    TrayConfig = "TRAY_CONFIG_2",
                    TrayPosition = 2,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Configuration = configurations[0]
                },
                new Tray
                {
                    TrayConfig = "TRAY_CONFIG_3",
                    TrayPosition = 3,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Configuration = configurations[0]
                },
                new Tray
                {
                    TrayConfig = "TRAY_CONFIG_4",
                    TrayPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Configuration = configurations[1]
                },
                new Tray
                {
                    TrayConfig = "TRAY_CONFIG_5",
                    TrayPosition = 2,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Configuration = configurations[1]
                },
                new Tray
                {
                    TrayConfig = "TRAY_CONFIG_6",
                    TrayPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Configuration = configurations[2]
                }
            };

            await context.Trays.AddRangeAsync(trays);
            await context.SaveChangesAsync();

            // Create Many-to-Many relationships through TrayProduct junction table
            var trayProducts = new List<TrayProduct>
            {
                // Configuration 0 (Production Line 1) - Tray 1
                new TrayProduct
                {
                    TrayId = trays[0].Id,
                    ProductId = products[0].Id, // Widget A
                    ProductChannelPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[0],
                    Product = products[0]
                },
                new TrayProduct
                {
                    TrayId = trays[0].Id,
                    ProductId = products[3].Id, // Part D
                    ProductChannelPosition = 2,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[0],
                    Product = products[3]
                },
                // Configuration 0 (Production Line 1) - Tray 2
                new TrayProduct
                {
                    TrayId = trays[1].Id,
                    ProductId = products[1].Id, // Component B
                    ProductChannelPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[1],
                    Product = products[1]
                },
                // Configuration 0 (Production Line 1) - Tray 3
                new TrayProduct
                {
                    TrayId = trays[2].Id,
                    ProductId = products[0].Id, // Widget A
                    ProductChannelPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[2],
                    Product = products[0]
                },
                new TrayProduct
                {
                    TrayId = trays[2].Id,
                    ProductId = products[3].Id, // Part D
                    ProductChannelPosition = 2,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[2],
                    Product = products[3]
                },
                // Configuration 1 (Assembly Line A) - Tray 1
                new TrayProduct
                {
                    TrayId = trays[3].Id,
                    ProductId = products[1].Id, // Component B
                    ProductChannelPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[3],
                    Product = products[1]
                },
                new TrayProduct
                {
                    TrayId = trays[3].Id,
                    ProductId = products[4].Id, // Sensor E
                    ProductChannelPosition = 2,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[3],
                    Product = products[4]
                },
                // Configuration 1 (Assembly Line A) - Tray 2
                new TrayProduct
                {
                    TrayId = trays[4].Id,
                    ProductId = products[2].Id, // Module C
                    ProductChannelPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[4],
                    Product = products[2]
                },
                new TrayProduct
                {
                    TrayId = trays[4].Id,
                    ProductId = products[5].Id, // Actuator F
                    ProductChannelPosition = 2,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[4],
                    Product = products[5]
                },
                // Configuration 2 (Quality Control Station) - Tray 1
                new TrayProduct
                {
                    TrayId = trays[5].Id,
                    ProductId = products[2].Id, // Module C
                    ProductChannelPosition = 1,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[5],
                    Product = products[2]
                },
                new TrayProduct
                {
                    TrayId = trays[5].Id,
                    ProductId = products[5].Id, // Actuator F
                    ProductChannelPosition = 2,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[5],
                    Product = products[5]
                },
                new TrayProduct
                {
                    TrayId = trays[5].Id,
                    ProductId = products[4].Id, // Sensor E
                    ProductChannelPosition = 3,
                    CreatedAt = DateTime.UtcNow,
                    Tray = trays[5],
                    Product = products[4]
                }
            };

            await context.TrayProducts.AddRangeAsync(trayProducts);
            await context.SaveChangesAsync();

            Console.WriteLine("Database seeded successfully!");
        }
    }
}
