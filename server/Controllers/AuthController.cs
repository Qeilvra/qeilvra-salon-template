using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Salon.Api.Domain.Entities;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;
using Salon.Api.Services;

namespace Salon.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokens;

    public AuthController(UserManager<ApplicationUser> userManager, ITokenService tokens)
    {
        _userManager = userManager;
        _tokens = tokens;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status201Created)]
    public async Task<ActionResult<AuthResponse>> Register(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _userManager.FindByEmailAsync(email) is not null)
        {
            throw ApiException.Conflict("An account already exists for this email address.", "email_in_use");
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = email,
            Email = email,
            PhoneNumber = request.Phone?.Trim(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            MarketingEmailsOptIn = request.MarketingEmailsOptIn,
            SmsOptIn = request.SmsOptIn
        };
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            throw ApiException.BadRequest(
                string.Join(" ", result.Errors.Select(error => error.Description)),
                "identity_validation_failed");
        }

        await _userManager.AddToRoleAsync(user, "Customer");
        var roles = (await _userManager.GetRolesAsync(user)).ToArray();
        var response = CreateResponse(user, roles);
        return CreatedAtAction(nameof(Me), response);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email.Trim());
        if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            throw new ApiException(
                StatusCodes.Status401Unauthorized,
                "Authentication failed",
                "The email address or password is incorrect.",
                "invalid_credentials");
        }

        user.LastSeenAtUtc = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);
        var roles = (await _userManager.GetRolesAsync(user)).ToArray();
        return Ok(CreateResponse(user, roles));
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType<AccountUserDto>(StatusCodes.Status200OK)]
    public async Task<ActionResult<AccountUserDto>> Me()
    {
        var id = User.RequireUserId();
        var user = await _userManager.FindByIdAsync(id.ToString())
            ?? throw ApiException.NotFound("Account not found.", "account_not_found");
        var roles = (await _userManager.GetRolesAsync(user)).ToArray();
        return Ok(MapUser(user, roles));
    }

    private AuthResponse CreateResponse(ApplicationUser user, IReadOnlyCollection<string> roles)
    {
        var token = _tokens.Create(user, roles);
        return new AuthResponse(token.Token, token.ExpiresAtUtc, MapUser(user, roles));
    }

    private static AccountUserDto MapUser(ApplicationUser user, IReadOnlyCollection<string> roles) =>
        new(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email ?? string.Empty,
            user.PhoneNumber,
            user.LoyaltyPoints,
            roles);
}
