# Stuff Manager - AI Coding Guide

This is a proof of concept project for AI-assisted development using GitHub Copilot. The project is a Stuff Manager, a personal possessions and belongings management application. It is designed to be a simple, user-friendly, and efficient way for users to manage their stuff.

---

## 🏗 Architecture Overview

**Core Pattern**: React SPA with .NET API backend and Postgres database.

**Key Technologies**:

- **Frontend**: React with Tailwind CSS for styling
- **Frontend State Management**: Redux using ducks and thunks for client-side state
- **Frontend Testing**: React Testing Library and Vitest for unit tests
- **End-To-End Testing**: Playwright for E2E tests
- **Backend API**: .NET API with Entity Framework Core
- **Backend Testing**: xUnit for integration tests using the Arrange/Act/Assert pattern and an in-memory database for testing
- **Authentication**: Microsoft Entra ID
- **Database**: Postgres for data storage and persistence
- **Database Migrations**: Entity Framework Core migrations for managing database schema changes
- **Build Tool**: Aspire and Vite for fast development
- **Deployment**: Azure for hosting
- **Infrastructure as Code**: Bicep for managing Azure resources
- **CI/CD**: Azure Devops for continuous integration and deployment
- **Frontend Deployment**: Azure Static Web Apps for hosting the React app
- **Backend API Deployment**: Azure Container Apps for hosting and Azure Container Registry for container images
- **Database Deployment**: Azure Database for PostgreSQL for hosting the database
- **Backend API Documentation**: Swagger for API documentation

**Development Principles**:

- **Simplicity**: Avoid over-engineering, keep it simple.
- **Readability**: Prioritize clear, maintainable code.
- **Single Responsibility**: Components should have a single, clear purpose.
- **Selective Abstraction**: Only abstract code when it provides real value.
- **User Experience**: Focus on intuitive, responsive UI/UX.
- **User Centric Testing**: Ensure all features are thoroughly tested from the perspective of the user using the website. Fine grained unit tests are less important than ensuring the user can complete their tasks without issues.
- **Code Coverage**: Maintain 100% code coverage with the automated tests.
- **Documentation**: Keep documentation up-to-date with code changes. The code should be self-documenting, but additional comments and documentation are encouraged to explain why code is doing what it is doing.
- **README**: Maintain a comprehensive README file that explains the project, how to set it up, and how to get it running and deployed.
- **CHANGELOG**: Maintain a CHANGELOG file that documents changes to the project, including new features, bug fixes, and breaking changes.
- **Semantic Versioning**: Use semantic versioning for releases (MAJOR.MINOR.PATCH).
- **Consistent Patterns**: Follow established patterns for API routes, state management, and component structure.
- **Deep Linking**: Use deep linking via easy to read URLs parameterized using path and query parameters to allow users to bookmark specific stuff and do a browser refresh on every page in the application.
- **Tailwind CSS**: Use utility-first CSS for styling, avoid custom CSS unless necessary.
- **Folder Structure**: Organize code by feature rather than type to keep related files together.
- **Solution Folder Structure**: Use a solution folder structure with separate folders for the frontend and backend application code.

### Key Data Flow

1. The application ensures the user is authenticated.
2. React pages fetch initial data via API requests. The UI shows a loading state while data is being fetched.
3. Components use Redux for client-side state management.
4. User interactions can trigger API calls to the backend.
5. API responses update the Redux state, which re-renders components.

## Infrastructure Overview

The infrastructure is designed to be scalable, secure, and maintainable. It uses Azure services for hosting and deployment, with a focus on using managed services where possible. As this is a proof of concept, lower cost and ease of management are prioritized over high availability and redundancy.

### Key Infrastructure Components

- **Azure Static Web Apps**: Hosts the React frontend, providing a fast and secure way to serve static content.
- **Azure Container Apps**: Hosts the .NET API backend, allowing for easy scaling and management of containerized applications.
- **Azure Database for PostgreSQL**: Managed database service for storing application data.
- **Azure Container Registry**: Stores Docker images for the backend API.
- **Azure Bicep**: Infrastructure as Code (IaC) tool for managing Azure resources, allowing for easy deployment and management of the infrastructure.
- **Azure Devops**: CI/CD pipeline for automating the build, test, and deployment processes.
- **Microsoft Entra ID**: Provides authentication and authorization for the application, ensuring secure access to resources.
- **Azure Key Vault**: Securely stores sensitive information such as connection strings and API keys.

### Deployment Workflow

1. **Frontend**: The React app is built and deployed to Azure Static Web Apps.
2. **Backend**: The .NET API is built into a Docker image and pushed to Azure Container Registry, then deployed to Azure Container Apps.
3. **Database**: The PostgreSQL database is provisioned and managed using Azure Database for PostgreSQL, with migrations applied using Entity Framework Core.

### Environments

1. **Development**: Local development environment using Docker Compose for the backend and database and Vite for the frontend.
2. **Testing**: Azure Static Web Apps for the frontend and Azure Container Apps for the backend, with a separate PostgreSQL database for testing.
3. **Production**: Azure Static Web Apps for the frontend and Azure Container Apps for the backend, with a production PostgreSQL database.

### Branching Strategy

- **Main Branch (main)**: Contains the latest stable code that is ready for production.
- **Development Branch (develop)**: Contains the latest development code that is being actively worked on.
- **Feature Branches (feature/\*)**: Created for each new feature or bug fix, based on the development branch. Merged back into development when complete.

## � Essential Development Patterns

### API Route Structure

- All API routes return consistent JSON responses.
- All API errors are handled gracefully with appropriate HTTP status codes and an error JSON response that includes an error message and an error code. Error codes should be unique and descriptive.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found."
  }
}
```

### State Management

- Use Redux for client-side state management.
- Follow the "ducks" pattern for organizing Redux code.
- Use thunks for asynchronous actions, especially for API calls.
- Use selectors to derive state for components.

---

## 🚀 Development Workflow

### Project Requirement Documentation

- Developers will use the [PRD template](.github/work-specifications/PRD-template.md) to document requirements for each phase of development.
- Each phase of development will have its own PRD file, which will be updated as the project progresses.
- Each requirement will have a unique ID, a description, status, acceptance criteria, and notes for additional context.
- The status of each requirement will be one of the following: Not Started, In Progress, Completed, Tested, or Blocked. The Copilot Agent will update the status of each requirement in the PRD as it is worked on.

### Frontend NPM Commands (PowerShell compatible)

```powershell
npm start            # Start local dev server
npm run build        # Production build
npm run preview      # Preview production build
npm test             # Run automated tests
npm run test:e2e     # Run end-to-end tests
npm run test:unit    # Run unit tests
npm run lint         # Run linter
```

### Adding New Features

1. **Database**: Create migrations for any schema changes
2. **API endpoint**: Create or update C# Controller with proper error handling
3. **Redux state**: Add actions, reducers, and selectors
4. **UI component**: Create React component

### Component Structure

Components follow focused responsibility pattern:

- `Login.tsx`: Handles user authentication and account creation
- `StuffList.tsx`: Lists user's stuff with pagination
- `AddStuff.tsx`: Form to add to user's stuff with validation, navigation on success
- `EditStuff.tsx`: Form to edit existing stuff with validation, navigation on success
- `StuffDetails.tsx`: Displays detailed view of a single item with related actions
- `Error.tsx`: Displays error messages for non-recoverable API errors

---

## 🔍 Key Integration Points

### Error Handling

Consistent patterns across components:

- Use `try/catch` for API calls
- Display user-friendly error messages
- If the error is recoverable, show error message near the relevant UI element
- If the error is not recoverable, redirect to an error page with a message
- Use `ErrorBoundary` for React components to catch rendering errors
- Use Redux for global error state management
- Loading states managed locally

---

## ⚛ React Component Best Practices

### ✅ When to Create a New Component

1. **If the JSX exceeds ~30 lines.**
2. **If the UI is used more than once.**
3. **If it has a clear single responsibility.**

```tsx
// ❌ BAD: Bloated file
export function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Click Me
      </button>
      <table>...</table>
    </div>
  );
}

// ✅ GOOD: Extracted components
export function Dashboard() {
  return (
    <div className="p-4">
      <Title>Dashboard</Title>
      <Button>Click Me</Button>
      <DataTable />
    </div>
  );
}
```

📌 **Rules:**

- **Keep components small and focused.**
- **Avoid abstraction unless it provides real value.**

---

## 🎨 Tailwind Best Practices

### ✅ Use Utility Classes Over Custom CSS

```tsx
// ✅ Prefer Tailwind utility classes
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="p-4 rounded-lg shadow-md bg-white">{children}</div>;
}
```

📌 **Rules:**

- **Avoid unnecessary `class` extractions.**
- **Use Tailwind’s built-in utilities.**

---

## 🧩 Redux Best Practices

### ✅ Use Ducks Pattern for Redux

- Organize Redux code by feature, not type.

### Use Thunks for Async Actions

- Use thunks for API calls and side effects.

---

## 🌿 Hooks Best Practices

### ✅ Only Create Hooks for Reusable Logic

```tsx
// src/hooks/useFetch.ts
import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData);
  }, [url]);

  return data;
}
```

📌 **Rules:**

- **No "just in case" hooks.**
- **Keep hooks simple and focused.**

---

## 🛠 Development Workflow Best Practices

### ✅ Consistent Coding Style

- Use **ESLint + Prettier** to enforce formatting.
- Keep **imports organized**:

```tsx
import { useState } from "react"; // React first
import { user } from "@/stores/auth"; // Stores second
import { Button } from "@/components/Button"; // Components last
```

---

## 🔥 Final Thoughts

1. **Avoid over-engineering.** Keep it simple.
2. **Prioritize readability over cleverness.**
3. **Only abstract when it provides real value.**
4. **Keep state management minimal.**
5. **Use Tailwind properly—don’t fight it.**
6. **Follow the established patterns.** Consistency is key.
7. **Document your code.** Use comments and README files to explain why, not just what.

---
