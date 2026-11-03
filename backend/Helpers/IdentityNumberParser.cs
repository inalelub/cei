namespace backend.Helpers;

/// <summary>
/// Reads the birthdate encoded in the first six digits (YYMMDD) of a South African ID number.
/// </summary>
public static class IdentityNumberParser
{
    /// <summary>
    /// Extracts the birthdate. A two-digit year is ambiguous, so a year greater than the current
    /// two-digit year is read as 19YY and anything else as 20YY.
    /// </summary>
    public static bool TryGetBirthDate(string? idNumber, DateOnly today, out DateOnly birthDate)
    {
        birthDate = default;

        if (idNumber is null || idNumber.Length < 6)
        {
            return false;
        }

        for (var i = 0; i < 6; i++)
        {
            if (!char.IsAsciiDigit(idNumber[i]))
            {
                return false;
            }
        }

        var yy = int.Parse(idNumber.AsSpan(0, 2));
        var month = int.Parse(idNumber.AsSpan(2, 2));
        var day = int.Parse(idNumber.AsSpan(4, 2));

        var year = (yy > today.Year % 100 ? 1900 : 2000) + yy;

        if (month is < 1 or > 12 || day < 1 || day > DateTime.DaysInMonth(year, month))
        {
            return false;
        }

        birthDate = new DateOnly(year, month, day);
        return true;
    }

    public static bool IsAtLeast(DateOnly birthDate, DateOnly today, int years)
    {
        var age = today.Year - birthDate.Year;
        if (birthDate > today.AddYears(-age))
        {
            age--;
        }

        return age >= years;
    }
}
