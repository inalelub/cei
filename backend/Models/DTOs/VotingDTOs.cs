namespace backend.Models.DTOs;

public record PartyDto(int Id, string PartyName, string PartyAbbreviation, string? PartyUrl, string? LogoUrl);

public record PartyResultDto(int PartyId, string PartyName, string PartyAbbreviation, int VoteCount, double VotePercentage);

public record VotingResultsDto(int TotalVotes, IReadOnlyList<PartyResultDto> Parties);

public record VotingStatsDto(int TotalVotes, int TotalUsers, int TotalVotedUsers, int TotalNonVotedUsers, double TurnoutPercentage);

public record UserVotingStatusDto(string UserId, bool HasVoted);
