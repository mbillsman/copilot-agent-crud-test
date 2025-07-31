var builder = DistributedApplication.CreateBuilder(args);

// Add PostgreSQL database
var postgres = builder.AddPostgreSQL("postgres")
    .WithDataVolume()
    .WithPgAdmin();

var database = postgres.AddDatabase("stuffmanager");

// Add API project
var api = builder.AddProject<Projects.StuffManager_Api>("api")
    .WithReference(database);

builder.Build().Run();
