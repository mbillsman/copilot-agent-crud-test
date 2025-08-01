using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using StuffManager.Api.Data;

namespace StuffManager.Api.Tests;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the existing database context
            var dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<StuffDbContext>));
            if (dbContextDescriptor != null)
            {
                services.Remove(dbContextDescriptor);
            }

            // Remove any Aspire service registrations that might conflict
            var aspireServices = services.Where(d => 
                d.ServiceType.FullName?.Contains("Aspire") == true ||
                d.ServiceType.ToString().Contains("ConnectionStringProvider") ||
                d.ServiceType.ToString().Contains("DbContextPool")).ToList();
            
            foreach (var service in aspireServices)
            {
                services.Remove(service);
            }

            // Add in-memory SQLite database
            services.AddDbContext<StuffDbContext>(options =>
                options.UseSqlite("DataSource=:memory:"));

            // Build service provider to seed database
            var serviceProvider = services.BuildServiceProvider();
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<StuffDbContext>();
            
            // Ensure database is created
            context.Database.EnsureCreated();
            
            // Seed with test data
            SeedDatabase(context);
        });

        builder.UseEnvironment("Testing");
    }

    private static void SeedDatabase(StuffDbContext context)
    {
        if (!context.Stuffs.Any())
        {
            for (int i = 1; i <= 12; i++)
            {
                context.Stuffs.Add(new Stuff
                {
                    Id = i,
                    Name = $"Stuff Item {i}",
                    Description = $"Description for stuff item {i}"
                });
            }
            context.SaveChanges();
        }
    }
}
