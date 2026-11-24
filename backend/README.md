# CEI — Backend API

An ASP.NET Core REST API for the CEI voting portal. Provides user registration with email confirmation, cookie-based authentication, and voting with one-vote-per-user enforcement.

## Technologies

- **.NET 10** — Runtime and SDK
- **ASP.NET Core** — Minimal API framework
- **Entity Framework Core 10** — ORM and migrations
- **ASP.NET Identity** — User management and authentication
- **SQL Server 2025** — Relational database
- **MailKit** — SMTP email delivery
- **Scalar** — Interactive API documentation UI
- **OpenAPI** — API specification
- **.NET Aspire** — Service defaults (OpenTelemetry, resilience, service discovery)
- **Docker** — Containerized deployment

## API Endpoints

### Authentication (`/api/auth`)

Registration, login, email confirmation, and password recovery are public. Logout and profile endpoints require authorization.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user (requires `Email`, `Password`, `FirstName`, `LastName`, `IdentityNumber`; optional `UserName`, `PhoneNumber`, `Address`) |
| POST | `/api/auth/login` | Authenticate (requires `UserName`, `Password`; email must be confirmed) |
| POST | `/api/auth/logout` | Sign out (requires auth) |
| GET | `/api/auth/confirm-email` | Confirm email via `?email={email}&token={token}` |
| POST | `/api/auth/resend-confirmation` | Resend the confirmation email |
| POST | `/api/auth/forgot-password` | Send a password reset link |
| GET | `/api/auth/reset-password` | Reset password via `?email={email}&token={token}` with `NewPassword` in body |
| GET | `/api/auth/me` | Get the authenticated user's profile |

### Voting (`/api/voting`)

All endpoints require the user to be authenticated.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/voting/parties` | List all available parties |
| POST | `/api/voting/vote?partyId={id}` | Cast a vote (one per user; returns `409` if already voted) |
| GET | `/api/voting/results` | Get vote counts grouped by party |

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- SQL Server (local, Docker, or remote)
- Optionally, Visual Studio 2022+, VS Code or Rider

## Getting Started

### 1. Configure the database connection

Update `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=cei;User Id=sa;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True"
  }
}
```

Or set the connection string via the `MSSQL_SA_PASSWORD` and `BACKEND_DEVELOPMENT_DATABASE_PASSWORD` environment variables used by `compose.yaml`.

### 2. Apply EF Core migrations

```bash
dotnet ef database update --project backend/backend.csproj
```

### 3. Run the API

```bash
dotnet run --project backend/backend.csproj --launch-profile Development
```

The API starts at `http://localhost:5102`.

### Running with Docker Compose

From the repository root:

```bash
docker compose up --build -d
```

| Service | URL |
|---|---|
| Backend API | http://localhost:5102 |
| Scalar API docs | http://localhost:5102/scalar/ |
| OpenAPI spec | http://localhost:5102/openapi/v1.json |
| Mailpit inbox | http://localhost:8025 |

The Docker image does not apply migrations automatically. See the [root README](../README.md) for the migration command against the Compose stack.

## Project Structure

```
backend/
├── Endpoints/
│   ├── IdentityEndpoints.cs   # Auth routes (register, login, logout, etc.)
│   └── VotingEndpoints.cs     # Voting routes (parties, vote, results)
├── Models/
│   ├── DTOs/                  # Request/response data transfer objects
│   ├── Enums/                 # Parties, Provinces, Role enums
│   ├── Party.cs               # Party entity
│   ├── Vote.cs                # Vote entity
│   └── Address.cs             # Address value object
├── Data/
│   ├── ApplicationDbContext.cs # EF Core DbContext
│   ├── ApplicationUser.cs     # Extended Identity user
│   └── DatabaseSeeder.cs      # Seed data
├── Properties/
│   └── launchSettings.json    # Launch profiles
├── Program.cs                 # Application startup and middleware
├── Dockerfile                 # Multi-stage container build
└── backend.csproj             # Project file and NuGet references
```

## Testing

The test project lives at `tests/backend.Tests/` and uses xUnit with `WebApplicationFactory` for integration tests and an in-memory database:

```bash
dotnet test tests/backend.Tests/backend.Tests.csproj
```

No external services (database, SMTP) are required to run tests.

## API Documentation

With the API running, visit:

- **Scalar UI** — http://localhost:5102/scalar/ — interactive API explorer
- **OpenAPI spec** — http://localhost:5102/openapi/v1.json

## Authentication

The API uses ASP.NET Identity with cookie-based sessions:

- Users register with an email, password, name, and identity number
- A confirmation email is sent; the account cannot log in until confirmed
- Login returns an authentication cookie used for subsequent requests
- Each user can vote exactly once — the API enforces this at the database level

## CORS

When the frontend and API run on different origins, configure `Cors__AllowedOrigins__0` to allow the frontend origin with credentials. For local development this is `http://localhost:3000`. The Docker Compose and Aspire configurations set this automatically.
