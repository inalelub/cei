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

Set the SQL Server password through the `DBPASSWORD` environment variable used by `compose.yaml`. Alternatively, change the DbContext in `Program.cs` to use the InMemory database provider.

### 3. Start the Email Service

The API sends confirmation and password-reset messages through Mailpit. Start the database and Mailpit services from the repository root:

```bash
docker compose up -d
```

Mailpit's web inbox is available at `http://localhost:8025`. The API's SMTP sender connects to the `mailpit` service on port `1025`; the API must run in the same Docker Compose network for email delivery. The current Compose file starts only the database and Mailpit, so running the API directly with `dotnet run` does not put it on that network.

### 4. Install Dependencies & Apply Migrations

```bash
dotnet restore
dotnet ef database update
```

### 5. Run the Application

```bash
dotnet run
```

The API will start on `https://localhost:5102` (or the port configured in `launchSettings.json`).

## API Documentation

Once the application is running:

- **Scalar UI**: Navigate to `https://localhost:5102/scalar/` for an interactive API explorer
- **OpenAPI Spec**: Available at `https://localhost:5102/openapi/v1.json`

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
