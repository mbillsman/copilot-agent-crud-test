# Stuff Manager

A proof of concept project for AI-assisted development using GitHub Copilot. This is a personal possessions and belongings management application built with .NET Aspire, ASP.NET Core API, React frontend, and PostgreSQL database.

## Architecture

- **Frontend**: React with Tailwind CSS, deployed to Azure Static Web Apps
- **Backend**: ASP.NET Core API, deployed to Azure Container Apps  
- **Database**: PostgreSQL, hosted on Azure Database for PostgreSQL
- **Infrastructure**: Azure Bicep for Infrastructure as Code
- **CI/CD**: GitHub Actions for automated builds and deployments

## Environments

- **Development**: Local development with Docker Compose
- **Staging**: Azure testing environment
- **Production**: Azure production environment

## Getting Started

This project is currently in the initialization phase. The development environment and Azure infrastructure are being set up.

## Project Structure

```
.
├── .github/                 # GitHub configurations and workflows
├── src/                     # Source code
│   ├── StuffManager.AppHost/     # Aspire app host
│   ├── StuffManager.Api/         # ASP.NET Core API
│   ├── StuffManager.Client/      # React frontend
│   └── StuffManager.ServiceDefaults/  # Aspire service defaults
├── tests/                   # Test projects
├── infra/                   # Bicep infrastructure files
└── docs/                    # Documentation
```

## Development Status

See the project requirements document in `.github/work-specifications/` for current development status and requirements.
