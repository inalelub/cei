# CEI

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-10.0-512BD4?logo=dotnet&logoColor=white)](https://learn.microsoft.com/aspnet/core/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2025-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Entity Framework Core](https://img.shields.io/badge/EF_Core-10.0-512BD4?logo=dotnet&logoColor=white)](https://learn.microsoft.com/ef/core/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![.NET Aspire](https://img.shields.io/badge/.NET_Aspire-17-512BD4?logo=dotnet&logoColor=white)](https://learn.microsoft.com/dotnet/aspire/)
[![Bun](https://img.shields.io/badge/Bun-1.3-F9F1E1?logo=bun&logoColor=black)](https://bun.sh/)

[//]: # ([![License]&#40;https://img.shields.io/badge/License-MIT-green.svg&#41;]&#40;LICENSE&#41;)

A voting portal built with an ASP.NET Core API backend and a Next.js frontend. Users register, confirm their email, log in, and cast a single vote for a political party. The backend enforces one-vote-per-user and manages authentication with ASP.NET Identity cookies.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | .NET 10, ASP.NET Core, Entity Framework Core, ASP.NET Identity |
| Database | SQL Server 2025 |
| Email | MailKit / Mailpit (dev) |
| Orchestration | .NET Aspire 17 / Docker Compose |
| CI | GitHub Actions |
| Testing | xUnit, Microsoft.AspNetCore.Mvc.Testing |

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Bun 1.3+](https://bun.sh/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Compose) or SQL Server locally

## Getting Started

### Option 1: .NET Aspire (recommended for development)

[Aspire](https://www.aspire.dev/) orchestrates the backend, frontend, SQL Server and Mailpit together:

```bash
aspire run
```

The Aspire dashboard opens automatically and shows all service URLs.

### Option 2: Docker Compose

Set the SQL Server password and start all services. You can create your own .env file or set the environment variables in your shell:

```bash
export MSSQL_SA_PASSWORD="YourStrongPassword"
export BACKEND_DEVELOPMENT_DATABASE_PASSWORD="YourStrongPassword"
docker compose up --build -d
```

Apply EF Core migrations (first run only):

```powershell
$env:ConnectionStrings__DefaultConnection = "Server=localhost,1433;Database=cei;User Id=sa;Password=<your-password>;Encrypt=True;TrustServerCertificate=True"
dotnet ef database update --project backend/backend.csproj
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5102 |
| Mailpit inbox | http://localhost:8025 |
| API docs (Scalar) | http://localhost:5102/scalar/ |

### Option 3: Run each project individually

See the [backend](backend/README.md) and [frontend](frontend/README.md) READMEs for standalone instructions.

## Project Structure

```
cei/
├── backend/                # ASP.NET Core REST API
│   ├── Endpoints/          # Auth and voting endpoint definitions
│   ├── Models/             # Domain models, DTOs, and enums
│   ├── Data/               # EF Core DbContext, migrations, and seeder
│   └── Dockerfile
├── frontend/               # Next.js application
│   ├── app/                # Pages and routes
│   ├── components/         # Shared UI components
│   ├── lib/                # API helpers and form definitions
│   └── Dockerfile
├── cei.AppHost/            # .NET Aspire orchestration
├── cei.ServiceDefaults/    # Shared service configuration (OpenTelemetry, resilience)
├── tests/
│   └── backend.Tests/      # xUnit integration and unit tests
├── compose.yaml            # Docker Compose stack
└── cei.sln                 # Solution file
```

## API Overview

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a session cookie |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/confirm-email` | Confirm email address |
| POST | `/api/auth/resend-confirmation` | Resend confirmation email |
| POST | `/api/auth/forgot-password` | Request a password reset |
| GET | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/me` | Get the authenticated user's profile |

### Voting (`/api/voting`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/voting/parties` | List available parties |
| POST | `/api/voting/vote?partyId={id}` | Cast a vote (one per user) |
| GET | `/api/voting/results` | Get vote counts by party |

All voting endpoints require authentication. The API returns `409 Conflict` if a user has already voted.

## Testing

```bash
dotnet test tests/backend.Tests/backend.Tests.csproj
```

The test project uses an in-memory database and a captured email sender — no external services needed.

## CI/CD

GitHub Actions workflows run on push and pull requests to `main`:

- **backend** — Restores, builds, and tests the .NET solution
- **frontend** — Installs dependencies with Bun and builds the Next.js app