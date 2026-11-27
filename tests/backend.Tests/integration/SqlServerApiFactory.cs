using backend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.MsSql;

namespace backend.Tests.integration;

/// <summary>
/// Runs the API against a real SQL Server (in Docker) instead of the in-memory provider.
/// Needed wherever behaviour depends on the database itself: transactions, ExecuteUpdate and
/// row locking under concurrent requests, none of which the in-memory provider supports.
/// </summary>
public sealed class SqlServerApiFactory : WebApplicationFactory<Program>
{
    // One container for the whole test run (starting SQL Server takes several seconds); each factory gets its own database on it, so tests stay isolated.
    private static readonly Lazy<Task<MsSqlContainer>> Container = new(async () =>
    {
        var container = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2022-latest").Build();
        await container.StartAsync();
        return container;
    });

    private readonly string _databaseName = $"VotingTests_{Guid.NewGuid():N}";

    // Keep auth redirects visible so tests can assert unauthenticated responses.
    public HttpClient CreateTestClient() => CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // ConfigureWebHost is synchronous; blocking here once per factory is fine in tests.
        var container = Container.Value.GetAwaiter().GetResult();
        var connectionString = new SqlConnectionStringBuilder(container.GetConnectionString()) { InitialCatalog = _databaseName }.ConnectionString;

        builder.ConfigureServices(services =>
        {
            // Program.cs applies the real migrations on startup (Development), so the schema matches production.
            services.RemoveAll<IDbContextOptionsConfiguration<ApplicationDbContext>>();
            services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
            services.RemoveAll<ApplicationDbContext>();
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

            services.RemoveAll<IEmailSender>();
            services.AddSingleton<IEmailSender, CapturingEmailSender>();
        });
    }
}
