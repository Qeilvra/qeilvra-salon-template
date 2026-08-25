using System.Security.Claims;

namespace Salon.Api.Infrastructure;

public static class ClaimsPrincipalExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(ClaimTypes.NameIdentifier) ??
                    principal.FindFirstValue("sub");
        return Guid.TryParse(value, out var id) ? id : null;
    }

    public static Guid RequireUserId(this ClaimsPrincipal principal) =>
        principal.GetUserId() ?? throw new ApiException(
            StatusCodes.Status401Unauthorized,
            "Authentication required",
            "The access token does not contain a valid user identifier.",
            "invalid_token");
}
