using System.Net;
using System.Net.Http.Json;
using backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Tests.integration;

public sealed class VotingEndpointsTests : IClassFixture<AuthApiFactory>
{
    private const string Password = "CorrectHorse1!";
    private readonly AuthApiFactory _factory;

    public VotingEndpointsTests(AuthApiFactory factory) => _factory = factory;

    [Theory]
    [InlineData("/api/voting/parties")]
    [InlineData("/api/voting/parties/1")]
    [InlineData("/api/voting/status")]
    public async Task ProtectedEndpoints_RejectAnonymousRequests(string url)
    {
        using var client = _factory.CreateTestClient();

        var response = await client.GetAsync(url);

        Assert.NotEqual(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Vote_RejectsAnonymousRequests()
    {
        using var client = _factory.CreateTestClient();

        var response = await client.PostAsync("/api/voting/vote?partyId=1", null);

        Assert.NotEqual(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task GetParties_ReturnsSeededParties()
    {
        using var client = await LoggedInClient();

        var parties = await client.GetFromJsonAsync<List<PartyResponse>>("/api/voting/parties");

        Assert.NotNull(parties);
        Assert.Equal(18, parties.Count);
        Assert.Contains(parties, p => p.PartyAbbreviation == "ANC");
    }

    [Fact]
    public async Task GetPartyById_ReturnsParty()
    {
        using var client = await LoggedInClient();

        var party = await client.GetFromJsonAsync<PartyResponse>("/api/voting/parties/5");

        Assert.NotNull(party);
        Assert.Equal(5, party.Id);
        Assert.Equal("ANC", party.PartyAbbreviation);
    }

    [Fact]
    public async Task GetPartyById_ReturnsNotFoundForUnknownParty()
    {
        using var client = await LoggedInClient();

        var response = await client.GetAsync("/api/voting/parties/9999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Vote_RecordsVoteAndMarksUserAsVoted()
    {
        var email = UniqueEmail();
        using var client = await LoggedInClient(email);
        var before = DateTime.UtcNow;

        var response = await client.PostAsync("/api/voting/vote?partyId=5", null);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var user = await db.Users.SingleAsync(u => u.Email == email);
        var vote = await db.Votes.SingleAsync(v => v.ApplicationUserId == user.Id);
        Assert.True(user.HasVoted);
        Assert.Equal(5, vote.PartyId);
        Assert.True(vote.CastAt >= before);
    }

    [Fact]
    public async Task Vote_WorksWhenUserNameDiffersFromEmail()
    {
        var email = UniqueEmail();
        using var client = await LoggedInClient(email, userName: $"user-{Guid.NewGuid():N}");

        var response = await client.PostAsync("/api/voting/vote?partyId=5", null);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Vote_ReturnsConflictWhenUserVotesTwice()
    {
        using var client = await LoggedInClient();
        Assert.Equal(HttpStatusCode.Created, (await client.PostAsync("/api/voting/vote?partyId=5", null)).StatusCode);

        var second = await client.PostAsync("/api/voting/vote?partyId=8", null);

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    [Theory]
    [InlineData("/api/voting/vote?partyId=9999")]
    [InlineData("/api/voting/vote")]
    public async Task Vote_ReturnsNotFoundForMissingOrUnknownParty_AndDoesNotConsumeVote(string url)
    {
        using var client = await LoggedInClient();

        var response = await client.PostAsync(url, null);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var status = await client.GetFromJsonAsync<StatusResponse>("/api/voting/status");
        Assert.NotNull(status);
        Assert.False(status.HasVoted);
    }

    [Fact]
    public async Task Status_ReflectsVotingState()
    {
        using var client = await LoggedInClient();

        var before = await client.GetFromJsonAsync<StatusResponse>("/api/voting/status");
        await client.PostAsync("/api/voting/vote?partyId=2", null);
        var after = await client.GetFromJsonAsync<StatusResponse>("/api/voting/status");

        Assert.False(before!.HasVoted);
        Assert.True(after!.HasVoted);
    }

    [Fact]
    public async Task Results_ArePublic_IncludeZeroVoteParties_AndCalculatePercentages()
    {
        // Use a fresh host so counts are not affected by other tests
        await using var factory = new AuthApiFactory();
        await VoteAs(factory, UniqueEmail(), partyId: 5);
        await VoteAs(factory, UniqueEmail(), partyId: 5);
        await VoteAs(factory, UniqueEmail(), partyId: 5);
        await VoteAs(factory, UniqueEmail(), partyId: 8);
        using var anonymous = factory.CreateTestClient();

        var results = await anonymous.GetFromJsonAsync<ResultsResponse>("/api/voting/results");

        Assert.NotNull(results);
        Assert.Equal(4, results.TotalVotes);
        Assert.Equal(18, results.Parties.Count);
        var anc = results.Parties.Single(p => p.PartyId == 5);
        Assert.Equal(3, anc.VoteCount);
        Assert.Equal(75, anc.VotePercentage);
        Assert.Equal(25, results.Parties.Single(p => p.PartyId == 8).VotePercentage);
        Assert.Equal(0, results.Parties.Single(p => p.PartyId == 1).VoteCount);
        Assert.Equal(5, results.Parties[0].PartyId); // ordered by votes, descending
    }

    [Fact]
    public async Task Results_WithNoVotes_ReturnZeroPercentages()
    {
        await using var factory = new AuthApiFactory();
        using var anonymous = factory.CreateTestClient();

        var results = await anonymous.GetFromJsonAsync<ResultsResponse>("/api/voting/results");

        Assert.NotNull(results);
        Assert.Equal(0, results.TotalVotes);
        Assert.All(results.Parties, p => Assert.Equal(0, p.VotePercentage));
    }

    [Fact]
    public async Task Stats_ArePublic_AndReportTurnout()
    {
        await using var factory = new AuthApiFactory();
        await VoteAs(factory, UniqueEmail(), partyId: 5);
        await CreateUser(factory, UniqueEmail());
        using var anonymous = factory.CreateTestClient();

        var stats = await anonymous.GetFromJsonAsync<StatsResponse>("/api/voting/stats");

        Assert.NotNull(stats);
        Assert.Equal(1, stats.TotalVotes);
        Assert.Equal(2, stats.TotalUsers);
        Assert.Equal(1, stats.TotalVotedUsers);
        Assert.Equal(1, stats.TotalNonVotedUsers);
        Assert.Equal(50, stats.TurnoutPercentage);
    }

    [Fact]
    public async Task Stats_WithNoUsers_ReturnZeroTurnout()
    {
        await using var factory = new AuthApiFactory();
        using var anonymous = factory.CreateTestClient();

        var stats = await anonymous.GetFromJsonAsync<StatsResponse>("/api/voting/stats");

        Assert.NotNull(stats);
        Assert.Equal(0, stats.TurnoutPercentage);
    }

    private Task<HttpClient> LoggedInClient(string? email = null, string? userName = null) =>
        LoggedInClient(_factory, email ?? UniqueEmail(), userName);

    private static async Task<HttpClient> LoggedInClient(AuthApiFactory factory, string email, string? userName = null)
    {
        userName ??= email;
        await CreateUser(factory, email, userName);
        var client = factory.CreateTestClient();
        var response = await client.PostAsJsonAsync("/api/auth/login", new { userName, password = Password });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return client;
    }

    private static async Task VoteAs(AuthApiFactory factory, string email, int partyId)
    {
        using var client = await LoggedInClient(factory, email);
        var response = await client.PostAsync($"/api/voting/vote?partyId={partyId}", null);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    private static async Task CreateUser(AuthApiFactory factory, string email, string? userName = null)
    {
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var user = new ApplicationUser
        {
            UserName = userName ?? email,
            Email = email,
            EmailConfirmed = true,
            FirstName = "Test",
            LastName = "Voter",
            IdentityNumber = Random.Shared.NextInt64(0, 10_000_000_000_000).ToString("D13"),
            PhoneNumber = "0123456789"
        };

        var result = await userManager.CreateAsync(user, Password);
        Assert.True(result.Succeeded, string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    private static string UniqueEmail() => $"vote-{Guid.NewGuid():N}@example.test";

    private sealed record PartyResponse(int Id, string PartyName, string PartyAbbreviation);
    private sealed record StatusResponse(string UserId, bool HasVoted);
    private sealed record PartyResultResponse(int PartyId, string PartyName, string PartyAbbreviation, int VoteCount, double VotePercentage);
    private sealed record ResultsResponse(int TotalVotes, List<PartyResultResponse> Parties);
    private sealed record StatsResponse(int TotalVotes, int TotalUsers, int TotalVotedUsers, int TotalNonVotedUsers, double TurnoutPercentage);
}
