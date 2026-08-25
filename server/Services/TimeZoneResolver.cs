using Salon.Api.Infrastructure;

namespace Salon.Api.Services;

internal static class TimeZoneResolver
{
    public static TimeZoneInfo Resolve(SalonOptions options)
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(options.TimeZoneId);
        }
        catch (TimeZoneNotFoundException) when (options.TimeZoneId == "Central Standard Time")
        {
            return TimeZoneInfo.FindSystemTimeZoneById("America/Chicago");
        }
    }

    public static DateTime ToUtc(DateOnly date, TimeOnly time, TimeZoneInfo zone)
    {
        var local = DateTime.SpecifyKind(date.ToDateTime(time), DateTimeKind.Unspecified);
        return TimeZoneInfo.ConvertTimeToUtc(local, zone);
    }
}
