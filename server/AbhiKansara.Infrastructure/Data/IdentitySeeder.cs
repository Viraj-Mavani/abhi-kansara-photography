using AbhiKansara.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AbhiKansara.Infrastructure.Data;

public static class IdentitySeeder
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole<Guid>> roleManager, ILogger logger)
    {
        logger.LogInformation("Seeding Identity Data...");

        string adminRoleName = "Admin";
        string adminEmail = "hello@abhikansaraphotography.com";
        string adminPassword = "Admin@123";

        if (!await roleManager.RoleExistsAsync(adminRoleName))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(adminRoleName));
            logger.LogInformation("Admin role created.");
        }

        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Abhi",
                LastName = "Kansara",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, adminRoleName);
                logger.LogInformation("Default Admin user created successfully.");
            }
            else
            {
                logger.LogError("Failed to create default Admin user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
        else
        {
            logger.LogInformation("Default Admin user already exists.");
        }
    }
}
