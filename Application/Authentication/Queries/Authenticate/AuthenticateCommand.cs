using Application.Common.Interfaces;
using Domain.Core;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Application.Authentication.Queries.Authenticate;

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

    public AuthenticateCommandHandler(
        UserManager<AppUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        IJwtTokenManager tokenManager)
        => (_userManager, _httpContextAccessor, _tokenManager) 
        = (userManager, httpContextAccessor, tokenManager);

    public async Task<string> Handle(AuthenticateCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            throw new UnauthorizedAccessException();
        }

        var verifyedResult = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (PasswordVerificationResult.Success != verifyedResult)
        {
            throw new UnauthorizedAccessException();
        }

        var token = _tokenManager.GenerateAccessToken(user);
        var refreshToken = _tokenManager.GenerateRefreshTokenAsync(user);

        user.Tokens.Add(new AppRefreshToken { 
            UserId = user.Id, 
            CreatedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
            Token = refreshToken,
            CreatedOn = DateTime.Now,
            ExpiryOn = DateTime.Now.AddDays(1),
            RevokedByIp = null
        });

        await _userManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            Secure = true,
            SameSite = SameSiteMode.None
        };

        _httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

        return token;
    }
}
