#pragma warning disable ASPIREJAVASCRIPT001, ASPIREBROWSERLOGS001 // experimental APIs

var builder = DistributedApplication.CreateBuilder(args);

var sqlPassword = builder.AddParameter("sql-password", secret: true);

var sql = builder.AddSqlServer("mssql", sqlPassword)
    .WithImageTag("2025-latest")
    .WithDataVolume("sqlvolume")
    .WithLifetime(ContainerLifetime.Persistent);

var db = sql.AddDatabase("cei");

var mailpit = builder.AddContainer("mailpit", "axllent/mailpit")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithVolume("mailpit-data", "/data")
    .WithEndpoint(targetPort: 1025, name: "smtp")
    .WithHttpEndpoint(targetPort: 8025, name: "ui")
    .WithUrlForEndpoint("ui", u => u.DisplayText = "Mailpit UI");

var frontend = builder.AddNextJsApp("frontend", "../frontend");

var backend = builder.AddDotnetProject("backend", "../backend/backend.csproj")
    .WithExternalHttpEndpoints()
    .WithEnvironment("ConnectionStrings__DefaultConnection", db)
    .WithEnvironment("Smtp__Host", mailpit.GetEndpoint("smtp").Property(EndpointProperty.Host))
    .WithEnvironment("Smtp__Port", mailpit.GetEndpoint("smtp").Property(EndpointProperty.Port))
    .WithEnvironment("Cors__AllowedOrigins__0", frontend.GetEndpoint("http"))
    .WaitFor(db)
    .WaitFor(mailpit);

frontend
    .WithEnvironment("NEXT_PUBLIC_API_BASE_URL", backend.GetEndpoint("http"))
    .WithEnvironment("API_INTERNAL_BASE_URL", backend.GetEndpoint("http"))
    .WaitFor(backend)
    .WithBrowserLogs();

builder.Build().Run();
