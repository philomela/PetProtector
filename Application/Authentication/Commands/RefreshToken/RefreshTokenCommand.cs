using System.Security.Claims;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace Application.Authentication.Commands.RefreshToken;

public record RefreshTokenCommand : IRequest<string>
{
    public string Token { get; set; }
}

internal record RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, string>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IJwtTokenManager _tokenManager;
    private readonly IWebHostEnvironment _environment;

    public RefreshTokenCommandHandler(UserManager<AppUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        IJwtTokenManager tokenManager,
        IWebHostEnvironment environment)
        => (_userManager, _httpContextAccessor, _tokenManager, _environment)
            = (userManager, httpContextAccessor, tokenManager, environment);

    public async Task<string> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var currentRefreshToken = _httpContextAccessor.HttpContext.Request.Cookies["refreshToken"]
                                  ?? throw new BadRequestException("Refresh token not found"); //todo: пересмотреть, возможно другое исключение

        var principal = _tokenManager.GetPrincipalFromToken(request.Token);

        var user = await _userManager.Users.Include(x => x.Tokens)
            .FirstOrDefaultAsync(x => x.Email == principal.FindFirst(ClaimTypes.Email)!.Value, cancellationToken);

        if (user is null || !user.EmailConfirmed) //Перепроверить условие, юзер должен быть акцептован
            throw new UnauthorizedAccessException();

        var existingToken =
            user.Tokens.FirstOrDefault(t => t.Token == currentRefreshToken && t.ExpiryOn >= DateTime.UtcNow);

        if (existingToken is null)
            throw new UnauthorizedAccessException();
        
        existingToken.RevokedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
        existingToken.RevokedOn = DateTime.UtcNow;
        existingToken.ExpiryOn = DateTime.UtcNow.AddDays(-1);
        
        var newRefreshToken = _tokenManager.GenerateRefreshTokenAsync(user);
        
        user.Tokens.Add(new AppRefreshToken { 
            UserId = user.Id, 
            CreatedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
            Token = newRefreshToken,
            CreatedOn = DateTime.UtcNow,
            ExpiryOn = DateTime.UtcNow.AddDays(1),
            RevokedByIp = null
        });
        
        await _userManager.UpdateAsync(user);

        var newAccessToken = _tokenManager.GenerateAccessToken(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            Secure = true,
            SameSite = _environment.IsProduction() ? SameSiteMode.Strict : SameSiteMode.None
        };

        
        _httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

        return newAccessToken;
    }
}