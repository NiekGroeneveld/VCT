using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(ApplicationDBContext context, UserManager<AppUser> userManager)
        {
            // Ensure database is created
            await context.Database.MigrateAsync();

            // Seed ConfigurationTypeData
            await SeedConfigurationTypeDataAsync(context);

            // Seed default admin user
            await SeedAdminUserAsync(userManager);
        }

        private static async Task SeedConfigurationTypeDataAsync(ApplicationDBContext context)
        {
            // Check if data already exists
            if (await context.ConfigurationTypeData.AnyAsync())
            {
                return; // Database has been seeded
            }

            var configurationTypeDataList = new List<ConfigurationTypeData>
            {
                new ConfigurationTypeData
                {
                    ConfigurationType = "VisionV8",
                    MinTrayHeight = 122,
                    TrayWidth = 640,
                    ConfigHeight = 1224,
                    AmountDots = 71,
                    DotsDelta = 135,
                    DoubleDotPositions = new List<int> { 2, 12, 22, 32, 42, 52, 62 },
                    ElevatorDotIndicators = new List<int> { 1, 3, 6, 7, 60, 64, 67, 70 },
                    LowExtractorHeight = 40,
                    LowExtractorDepth = 60,
                    HighExtractorHeight = 55,
                    HighExtractorDepth = 60,
                    PalletDelta = 135
                },
                new ConfigurationTypeData
                {
                    ConfigurationType = "Nuuk",
                    MinTrayHeight = 122,
                    TrayWidth = 600,
                    ConfigHeight = 1040,
                    AmountDots = 65,
                    DotsDelta = 135,
                    DoubleDotPositions = new List<int> { 1, 11, 21, 31, 41, 51, 61 },
                    ElevatorDotIndicators = new List<int>(),
                    LowExtractorHeight = 40,
                    LowExtractorDepth = 60,
                    HighExtractorHeight = 55,
                    HighExtractorDepth = 60,
                    PalletDelta = 135
                }
            };

            await context.ConfigurationTypeData.AddRangeAsync(configurationTypeDataList);
            await context.SaveChangesAsync();
        }

        private static async Task SeedAdminUserAsync(UserManager<AppUser> userManager)
        {
            // Check if the admin user already exists
            var adminEmail = "niek@vendolution.nl";
            var existingUser = await userManager.FindByEmailAsync(adminEmail);

            if (existingUser != null)
            {
                return; // User already exists
            }

            // Create the admin user
            var adminUser = new AppUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, "Vendolution2025!");

            if (result.Succeeded)
            {
                // Add the user to the Admin role
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
            else
            {
                // Log errors if needed
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to create admin user: {errors}");
            }
        }
    }
}
