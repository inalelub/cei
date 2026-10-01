using System.Collections.Concurrent;
using backend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace backend.Tests.integration;

public sealed class AuthApiFactory : WebApplicationFactory<Program>
{
    public CapturingEmailSender EmailSender => Services.GetRequiredService<CapturingEmailSender>();

    // Keep auth redirects visible so tests can assert unauthenticated responses.
    public HttpClient CreateTestClient() => CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        var databaseName = $"AuthTests-{Guid.NewGuid()}";
        builder.ConfigureServices(services =>
        {
            // Avoid requiring SQL Server while keeping each test host's data isolated.
            services.RemoveAll<IDbContextOptionsConfiguration<ApplicationDbContext>>();
            services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
            services.RemoveAll<ApplicationDbContext>();
            services.AddDbContext<ApplicationDbContext>(options => options.UseInMemoryDatabase(databaseName));

            // Capture confirmation/reset links instead of sending real email.
            services.RemoveAll<IEmailSender>();
            services.AddSingleton<CapturingEmailSender>();
            services.AddSingleton<IEmailSender>(provider => provider.GetRequiredService<CapturingEmailSender>());
        });
    }
}

public sealed record SentEmail(string To, string Subject, string HtmlMessage);

// Captures generated email content so tests can reuse the embedded Identity tokens.
public sealed class CapturingEmailSender : IEmailSender
{
    private readonly ConcurrentQueue<SentEmail> _messages = new();

    public IReadOnlyCollection<SentEmail> Messages => _messages.ToArray();

    public Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        _messages.Enqueue(new SentEmail(email, subject, htmlMessage));
        return Task.CompletedTask;
    }

    public void Clear()
    {
        while (_messages.TryDequeue(out _))
        {
        }
    }
}
