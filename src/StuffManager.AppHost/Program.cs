var builder = DistributedApplication.CreateBuilder(args);

// Add API project  
var api = builder.AddProject<Projects.StuffManager_Api>("api");

// TODO: PostgreSQL configuration - extension method not found with current package versions
// Issue: 'IDistributedApplicationBuilder' does not contain definition for 'AddPostgreSQL'
// Need to investigate proper package versions and configuration for Aspire 9.0

builder.Build().Run();
