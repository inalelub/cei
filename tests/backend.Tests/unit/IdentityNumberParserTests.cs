using backend.Helpers;

namespace backend.Tests.unit;

public class IdentityNumberParserTests
{
    private static readonly DateOnly Today = new(2026, 11, 3);

    [Theory]
    [InlineData("0501015800087", 2005, 1, 1)]   // 05 <= 26 -> 2005
    [InlineData("8512315800087", 1985, 12, 31)] // 85 > 26 -> 1985
    [InlineData("2611035800087", 2026, 11, 3)]  // pivot year itself -> 2026
    [InlineData("2701015800087", 1927, 1, 1)]   // one above pivot -> 1927
    [InlineData("0002295800087", 2000, 2, 29)]  // 2000 is a leap year
    public void TryGetBirthDate_ValidInput_ParsesDateWithPivotCentury(string id, int year, int month, int day)
    {
        var ok = IdentityNumberParser.TryGetBirthDate(id, Today, out var birthDate);

        Assert.True(ok);
        Assert.Equal(new DateOnly(year, month, day), birthDate);
    }

    [Theory]
    [InlineData("9013015800087")] // month 13
    [InlineData("9000015800087")] // month 00
    [InlineData("9001005800087")] // day 00
    [InlineData("9001325800087")] // day 32
    [InlineData("9004315800087")] // 31 April
    [InlineData("9002305800087")] // 30 February
    [InlineData("0102295800087")] // 29 Feb 2001, not a leap year
    [InlineData("8502295800087")] // 29 Feb 1985, not a leap year
    [InlineData("90A1015800087")] // non-digit
    [InlineData("90010")]         // too short
    [InlineData("")]
    [InlineData(null)]
    public void TryGetBirthDate_InvalidInput_ReturnsFalse(string? id)
    {
        var ok = IdentityNumberParser.TryGetBirthDate(id, Today, out var birthDate);

        Assert.False(ok);
        Assert.Equal(default, birthDate);
    }

    [Fact]
    public void TryGetBirthDate_LeapDay_ParsesInLeapYear()
    {
        var ok = IdentityNumberParser.TryGetBirthDate("9602295800087", Today, out var birthDate);

        Assert.True(ok);
        Assert.Equal(new DateOnly(1996, 2, 29), birthDate);
    }

    [Fact]
    public void IsAtLeast_DayBeforeEighteenthBirthday_ReturnsFalse()
    {
        var birthDate = new DateOnly(2008, 11, 4);

        Assert.False(IdentityNumberParser.IsAtLeast(birthDate, Today, 18));
    }

    [Fact]
    public void IsAtLeast_OnEighteenthBirthday_ReturnsTrue()
    {
        var birthDate = new DateOnly(2008, 11, 3);

        Assert.True(IdentityNumberParser.IsAtLeast(birthDate, Today, 18));
    }

    [Fact]
    public void IsAtLeast_DayAfterEighteenthBirthday_ReturnsTrue()
    {
        var birthDate = new DateOnly(2008, 11, 2);

        Assert.True(IdentityNumberParser.IsAtLeast(birthDate, Today, 18));
    }

    [Fact]
    public void IsAtLeast_LeapDayBirthday_TurnsEighteenOnFirstMarchInNonLeapYear()
    {
        var birthDate = new DateOnly(2008, 2, 29);

        Assert.False(IdentityNumberParser.IsAtLeast(birthDate, new DateOnly(2026, 2, 28), 18));
        Assert.True(IdentityNumberParser.IsAtLeast(birthDate, new DateOnly(2026, 3, 1), 18));
    }

    [Fact]
    public void IsAtLeast_Minor_ReturnsFalse()
    {
        var birthDate = new DateOnly(2015, 6, 1);

        Assert.False(IdentityNumberParser.IsAtLeast(birthDate, Today, 18));
    }
}
