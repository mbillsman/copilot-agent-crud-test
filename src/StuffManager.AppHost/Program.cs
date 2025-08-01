var builder = DistributedApplication.CreateBuilder(args);

// Add PostgreSQL database
var postgres = builder.AddPostgres("postgres")
    .AddDatabase("stuffmanager");

// Add API project with PostgreSQL dependency
var api = builder.AddProject<Projects.StuffManager_Api>("api")
    .WithReference(postgres);

builder.Build().Run();
