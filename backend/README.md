# Backend API

A .NET 10.0 ASP.NET Core REST API for a voting application. This backend provides user authentication and voting functionality with a SQL Server database.

## Overview

This project implements a secure voting system with user registration, authentication, and vote management. Built with ASP.NET Core Identity for robust user management and Entity Framework Core for data persistence.

## Technologies

- **.NET 10.0** - Latest .NET framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM for data access
- **SQL Server** - Database
- **ASP.NET Identity** - Authentication & authorization
- **OpenAPI/Swagger** - API documentation
- **Scalar** - Interactive API reference UI
- **Docker** - Containerization support

## API Endpoints

### Authentication (`/api/auth`)

Registration, login, email confirmation, and password recovery endpoints are public. Logout and profile endpoints require authorization.

- **POST** `/api/auth/register` - Register a new user
  - Requires: `Email`, `Password`, `FirstName`, `LastName`, `IdentityNumber`
  - Optional: `UserName` (defaults to the email address), `PhoneNumber`, `Address`
  - Sends an email confirmation link; the account cannot sign in until the email is confirmed
  - Returns: User ID and Email

- **POST** `/api/auth/login` - Authenticate user
  - Requires: `UserName`, `Password`
  - Requires a confirmed email address
  - Returns: Authentication status and establishes an authentication cookie

- **POST** `/api/auth/logout` - Sign out (requires authorization)
  - Returns: Success status

- **GET** `/api/auth/confirm-email?email={email}&token={token}` - Confirm an email address
- **POST** `/api/auth/resend-confirmation` - Send another confirmation email
  - Requires: `Email`
- **POST** `/api/auth/forgot-password` - Send a password reset link
  - Requires: `Email`
- **GET** `/api/auth/reset-password?email={email}&token={token}` - Reset a password
  - Requires a request body containing `NewPassword`
- **GET** `/api/auth/me` - Get the authenticated user's profile

### Voting (`/api/voting`)

All endpoints require the user to be authenticated.

- **GET** `/api/voting/parties` - Get all available parties
  - Returns: List of parties

- **POST** `/api/voting/votes?partyId={id}` - Cast a vote
  - Requires: `partyId` query parameter
  - Enforces: Each user can vote only once
  - Returns: Success or conflict if already voted

- **GET** `/api/voting/results` - Get voting results
  - Returns: Vote counts grouped by party

## Prerequisites

- .NET 10.0 SDK or later
- SQL Server (local or remote)
- Visual Studio 2022 (optional, for development)

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:inalelub/cei.git
cd cei/backend
```

### 2. Configure Database Connection

Update the connection string in `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=voting_db;User Id=sa;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True"
  }
}
```

Set the SQL Server password through the `MSSQL_SA_PASSWORD` and `BACKEND_DEVELOPMENT_DATABASE_PASSWORD` environment variable used by `compose.yaml`. Alternatively, change the DbContext in `Program.cs` to use the InMemory database provider.

### 3. Start the application with Docker Compose

```bash
docker compose up --build -d
```

The frontend is available at `http://localhost:3000`, the API at `http://localhost:5102`, and Mailpit's web inbox at `http://localhost:8025`. The API connects to SQL Server at the Compose service name `db` and sends email through `mailpit`.

The API image does not apply database migrations automatically. Apply the existing EF Core migrations with the .NET SDK before using database-backed endpoints. From the repository root, set the connection string to the published SQL Server port (`localhost,1433`) and run:

```powershell
$env:ConnectionStrings__DefaultConnection = "Server=localhost,1433;Database=voting_db;User Id=sa;Password=<BACKEND_DEVELOPMENT_DATABASE_PASSWORD>;Encrypt=True;TrustServerCertificate=True"
dotnet ef database update --project backend/backend.csproj
```

To run the tests separately, from the repository root:

```bash
dotnet test tests/backend.Tests/backend.Tests.csproj
```

The test project uses an in-memory database and a captured email sender, so it does not need its own Dockerfile or a service in the default Compose stack.

## API Documentation

With the Compose stack running:

- **Scalar UI**: Navigate to `http://localhost:5102/scalar/` for an interactive API explorer
- **OpenAPI Spec**: Available at `http://localhost:5102/openapi/v1.json`

## Project Structure

```
backend/
├── Endpoints/           # API endpoint definitions
├── Models/              # Data models
├── Data/                # DbContext and migrations
├── Properties/          # Launch settings
├── Program.cs           # Application startup
└── backend.csproj       # Project configuration
```

## Authentication

The API uses ASP.NET Identity with cookie-based sessions:
- Users must register and login to access voting endpoints
- Email addresses must be unique
- Authentication is enforced via the `RequireAuthorization()` middleware

## Database

The application uses Entity Framework Core with SQL Server:
- User identity data stored with ASP.NET Identity tables
- Voting records tracked to prevent duplicate votes
- Party data and voting results available via API

## Development

### Run in Development Mode

```bash
dotnet run --launch-profile Development
```

or 

```
Ctrl + F5 on your development IDE
```

### Docker Support

Build and run with Docker. The Dockerfile is built using ```compose.yml``` file at the root directory of the repository.

## Notes

- Each user can vote exactly once (enforced at the API level)
- All voting endpoints require authentication
- The API uses HTTPS redirects in production
