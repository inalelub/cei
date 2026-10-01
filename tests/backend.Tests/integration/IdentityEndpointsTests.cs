using System.Net;
using System.Net.Http.Json;
using System.Text.RegularExpressions;
using backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Tests.integration;

public sealed class IdentityEndpointsTests(AuthApiFactory factory) : IClassFixture<AuthApiFactory>
{
    private const string InitialPassword = "CorrectHorse1!";
    private const string NewPassword = "EvenBetter2!";

    [Fact]
    public async Task Register_CreatesUserAndSendsConfirmationEmail()
    {
        var email = UniqueEmail();
        factory.EmailSender.Clear();
        using var client = factory.CreateTestClient();

        var response = await client.PostAsJsonAsync("/api/auth/register", RegistrationRequest(email));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var messages = factory.EmailSender.Messages;
        var sentEmail = Assert.Single(messages);
        Assert.Equal(email, sentEmail.To);
        Assert.Equal("Confirm your email", sentEmail.Subject);

        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        Assert.NotNull(await userManager.FindByEmailAsync(email));
    }

    [Fact]
    public async Task Register_ReturnsBadRequestForDuplicateEmail()
    {
        var email = UniqueEmail();
        await CreateUser(email);
        using var client = factory.CreateTestClient();

        var response = await client.PostAsJsonAsync("/api/auth/register", RegistrationRequest(email));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_AllowsConfirmedUserToRetrieveProfile()
    {
        var email = UniqueEmail();
        await CreateUser(email, emailConfirmed: true);
        using var client = factory.CreateTestClient();

        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new
        {
            userName = email,
            password = InitialPassword
        });

        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        var profileResponse = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, profileResponse.StatusCode);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorizedForInvalidPassword()
    {
        var email = UniqueEmail();
        await CreateUser(email, emailConfirmed: true);
        using var client = factory.CreateTestClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            userName = email,
            password = "WrongPassword1!"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_ReturnsForbiddenForUnconfirmedUser()
    {
        var email = UniqueEmail();
        await CreateUser(email, emailConfirmed: false);
        using var client = factory.CreateTestClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            userName = email,
            password = InitialPassword
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Logout_ClearsAuthenticatedSession()
    {
        var email = UniqueEmail();
        await CreateUser(email, emailConfirmed: true);
        using var client = factory.CreateTestClient();
        await Login(client, email);

        var logoutResponse = await client.PostAsync("/api/auth/logout", content: null);
        var profileResponse = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);
        Assert.Equal(HttpStatusCode.Found, profileResponse.StatusCode);
    }

    [Fact]
    public async Task ConfirmEmail_ConfirmsUserUsingRegistrationEmailToken()
    {
        var email = UniqueEmail();
        factory.EmailSender.Clear();
        using var client = factory.CreateTestClient();
        var registerResponse = await client.PostAsJsonAsync(
            "/api/auth/register",
            RegistrationRequest(email));
        Assert.Equal(HttpStatusCode.Created, registerResponse.StatusCode);
        var message = Assert.Single(factory.EmailSender.Messages);
        var query = ReadEmailLinkQuery(message);

        var response = await client.GetAsync(
            $"/api/auth/confirm-email?email={Uri.EscapeDataString(query["email"])}&token={Uri.EscapeDataString(query["token"])}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        Assert.True((await userManager.FindByEmailAsync(email))?.EmailConfirmed);
    }

    [Fact]
    public async Task ConfirmEmail_ReturnsNotFoundForUnknownEmail()
    {
        using var client = factory.CreateTestClient();

        var response = await client.GetAsync(
            $"/api/auth/confirm-email?email={Uri.EscapeDataString(UniqueEmail())}&token=token");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ConfirmEmail_ReturnsBadRequestForInvalidToken()
    {
        var email = UniqueEmail();
        await CreateUser(email, emailConfirmed: false);
        using var client = factory.CreateTestClient();

        var response = await client.GetAsync(
            $"/api/auth/confirm-email?email={Uri.EscapeDataString(email)}&token=invalid-token");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ResendConfirmation_SendsEmailForExistingUser()
    {
        var email = UniqueEmail();
        await CreateUser(email, emailConfirmed: false);
        factory.EmailSender.Clear();
        using var client = factory.CreateTestClient();

        var response = await client.PostAsJsonAsync("/api/auth/resend-confirmation", new { email });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var sentEmail = Assert.Single(factory.EmailSender.Messages);
        Assert.Equal(email, sentEmail.To);
        Assert.Equal("Confirm your email", sentEmail.Subject);
    }

    [Fact]
    public async Task ResendConfirmation_ReturnsNotFoundForUnknownEmail()
    {
        using var client = factory.CreateTestClient();

        var response = await client.PostAsJsonAsync(
            "/api/auth/resend-confirmation",
            new { email = UniqueEmail() });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ForgotPassword_SendsResetEmailForExistingUser()
    {
        var email = UniqueEmail();
        await CreateUser(email);
        factory.EmailSender.Clear();
        using var client = factory.CreateTestClient();

        var response = await client.PostAsJsonAsync("/api/auth/forgot-password", new { email });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var sentEmail = Assert.Single(factory.EmailSender.Messages);
        Assert.Equal(email, sentEmail.To);
        Assert.Equal("Reset your password", sentEmail.Subject);
    }

    [Fact]
    public async Task ForgotPassword_ReturnsNotFoundForUnknownEmail()
    {
        using var client = factory.CreateTestClient();

        var response = await client.PostAsJsonAsync(
            "/api/auth/forgot-password",
            new { email = UniqueEmail() });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ResetPassword_ChangesPasswordUsingEmailToken()
    {
        var email = UniqueEmail();
        await CreateUser(email);
        factory.EmailSender.Clear();
        using var client = factory.CreateTestClient();
        var forgotResponse = await client.PostAsJsonAsync("/api/auth/forgot-password", new { email });
        Assert.Equal(HttpStatusCode.OK, forgotResponse.StatusCode);
        var message = Assert.Single(factory.EmailSender.Messages);
        var query = ReadEmailLinkQuery(message);
        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"/api/auth/reset-password?email={Uri.EscapeDataString(query["email"])}&token={Uri.EscapeDataString(query["token"])}")
        {
            Content = JsonContent.Create(new { newPassword = NewPassword })
        };

        var response = await client.SendAsync(request);
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new
        {
            userName = email,
            password = NewPassword
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
    }

    [Fact]
    public async Task ResetPassword_ReturnsNotFoundForUnknownEmail()
    {
        using var client = factory.CreateTestClient();
        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"/api/auth/reset-password?email={Uri.EscapeDataString(UniqueEmail())}&token=token")
        {
            Content = JsonContent.Create(new { newPassword = NewPassword })
        };

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ResetPassword_ReturnsBadRequestForInvalidToken()
    {
        var email = UniqueEmail();
        await CreateUser(email);
        using var client = factory.CreateTestClient();
        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"/api/auth/reset-password?email={Uri.EscapeDataString(email)}&token=invalid-token")
        {
            Content = JsonContent.Create(new { newPassword = NewPassword })
        };

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Me_RedirectsToLoginWithoutAuthentication()
    {
        using var client = factory.CreateTestClient();

        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Found, response.StatusCode);
    }

    [Fact]
    public async Task Me_ReturnsAuthenticatedUserProfile()
    {
        var email = UniqueEmail();
        var user = await CreateUser(email, emailConfirmed: true);
        using var client = factory.CreateTestClient();
        await Login(client, email);

        var response = await client.GetAsync("/api/auth/me");
        var profile = await response.Content.ReadFromJsonAsync<UserProfile>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(profile);
        Assert.Equal(email, profile.Email);
        Assert.Equal(user.FirstName, profile.FirstName);
        Assert.Equal(user.LastName, profile.LastName);
        Assert.Equal(user.IdentityNumber, profile.IdentityNumber);
    }

    private async Task<ApplicationUser> CreateUser(
        string email,
        bool emailConfirmed = true,
        string password = InitialPassword)
    {
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = emailConfirmed,
            FirstName = "Test",
            LastName = "Voter",
            IdentityNumber = Random.Shared.NextInt64(0, 10_000_000_000_000).ToString("D13"),
            PhoneNumber = "0123456789"
        };

        var result = await userManager.CreateAsync(user, password);
        Assert.True(result.Succeeded, string.Join("; ", result.Errors.Select(error => error.Description)));
        return user;
    }

    private static async Task Login(HttpClient client, string email)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            userName = email,
            password = InitialPassword
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private static object RegistrationRequest(string email) => new
    {
        email,
        userName = email,
        firstName = "Test",
        lastName = "Voter",
        identityNumber = Random.Shared.NextInt64(0, 10_000_000_000_000).ToString("D13"),
        phoneNumber = "0123456789",
        password = InitialPassword
    };


    private static Dictionary<string, string> ReadEmailLinkQuery(SentEmail email)
    {
        var match = Regex.Match(email.HtmlMessage, @"https?://[^\s<>]+");
        Assert.True(match.Success, "Expected the email body to include an absolute link.");
        return QueryHelpers.ParseQuery(new Uri(match.Value).Query).ToDictionary(pair => pair.Key, pair => pair.Value.ToString());
    }
    
    private static string UniqueEmail() => $"auth-{Guid.NewGuid():N}@example.test";

    private sealed record UserProfile(string? IdentityNumber, string? Email, string? FirstName, string? LastName);
}
