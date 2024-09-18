using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;

namespace Application.Authentication.Commands.Authenticate;

public record AuthenticateCommand : IRequest<string>
{
    public string Email { get; set; }

    public string Password { get; set; }
}

internal record AuthenticateCommandHandler : IRequestHandler<AuthenticateCommand, string>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IJwtTokenManager _tokenManager;
    private readonly IHostEnvironment _environment;

    public AuthenticateCommandHandler(
        UserManager<AppUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        IJwtTokenManager tokenManager,
        IHostEnvironment environment)
        => (_userManager, _httpContextAccessor, _tokenManager, _environment)
            = (userManager, httpContextAccessor, tokenManager, environment);

    public async Task<string> Handle(AuthenticateCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null || !user.EmailConfirmed) // Перепроверить условие, юзеры должны быть акцептованы
        {
            throw new UnauthorizedAccessException();
        }

        var verifyedResult =
            _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (PasswordVerificationResult.Success != verifyedResult)
        {
            throw new UnauthorizedAccessException();
        }

        var token = _tokenManager.GenerateAccessToken(user);
        var refreshToken = _tokenManager.GenerateRefreshTokenAsync(user);

        user.Tokens.Add(new AppRefreshToken
        {
            UserId = user.Id,
            CreatedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
            Token = refreshToken,
            CreatedOn = DateTime.UtcNow,
            ExpiryOn = DateTime.UtcNow.AddDays(1),
            RevokedByIp = null
        });

        await _userManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            Secure = true,
            SameSite = _environment.IsProduction() ? SameSiteMode.Strict : SameSiteMode.None
        };

        _httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

        return token;
    }
}