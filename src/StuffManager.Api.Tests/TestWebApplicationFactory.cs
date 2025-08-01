using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StuffManager.Api.Data;

namespace StuffManager.Api.Tests;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        
        // Configure test settings to override Aspire configuration
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                // Provide valid PostgreSQL connection strings that Aspire expects
                ["ConnectionStrings:stuffmanager"] = "Host=localhost;Database=test;Username=test;Password=test",
                ["Aspire:Npgsql:EntityFrameworkCore:PostgreSQL:ConnectionString"] = "Host=localhost;Database=test;Username=test;Password=test",
                ["Aspire:Npgsql:EntityFrameworkCore:PostgreSQL:StuffDbContext:ConnectionString"] = "Host=localhost;Database=test;Username=test;Password=test",
                // Disable Aspire health checks and other services
                ["Aspire:Npgsql:HealthChecks:Enabled"] = "false",
                ["Aspire:Npgsql:Tracing:Enabled"] = "false",
                ["Aspire:Npgsql:Metrics:Enabled"] = "false"
            });
        });
        
        builder.ConfigureServices(services =>
        {
            // Remove all database-related services registered by Aspire
            var descriptorsToRemove = services.Where(d =>
                d.ServiceType == typeof(DbContextOptions<StuffDbContext>) ||
                d.ServiceType == typeof(StuffDbContext) ||
                d.ServiceType.IsGenericType && d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>) ||
                d.ServiceType.FullName?.Contains("DbContextPool") == true ||
                d.ServiceType.FullName?.Contains("Aspire") == true ||
                d.ServiceType.FullName?.Contains("ConnectionStringProvider") == true ||
                d.ServiceType.FullName?.Contains("Npgsql") == true).ToList();
            
            foreach (var descriptor in descriptorsToRemove)
            {
                services.Remove(descriptor);
            }

            // Add in-memory SQLite database
            services.AddDbContext<StuffDbContext>(options =>
                options.UseSqlite("DataSource=:memory:"));
        });
    }

    public void SeedDatabase()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<StuffDbContext>();
        
        // Ensure database is created
        context.Database.EnsureCreated();
        
        // Seed with test data if not already seeded
        if (!context.Stuffs.Any())
        {
            SeedDatabaseInternal(context);
        }
    }

    private static void SeedDatabaseInternal(StuffDbContext context)
    {
        for (int i = 1; i <= 12; i++)
        {
            context.Stuffs.Add(new Stuff
            {
                Name = $"Test Item {i}",
                Description = $"Description for test item {i}"
            });
        }
        context.SaveChanges();
    }
}
