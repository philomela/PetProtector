using System.Security.Claims;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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
    private readonly IConfiguration _configuration;

    public RefreshTokenCommandHandler(UserManager<AppUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        IJwtTokenManager tokenManager,
        IConfiguration configuration)
        => (_userManager, _httpContextAccessor, _tokenManager, _configuration)
            = (userManager, httpContextAccessor, tokenManager, configuration);

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
            user.Tokens.FirstOrDefault(t => t.Token == currentRefreshToken && t.ExpiryOn >= DateTime.Now);

        if (existingToken is null)
            throw new UnauthorizedAccessException();
        
        existingToken.RevokedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
        existingToken.RevokedOn = DateTime.Now;
        existingToken.ExpiryOn = DateTime.Now.AddDays(-1);
        
        var newRefreshToken = _tokenManager.GenerateRefreshTokenAsync(user);
        
        user.Tokens.Add(new AppRefreshToken { 
            UserId = user.Id, 
            CreatedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
            Token = newRefreshToken,
            CreatedOn = DateTime.Now,
            ExpiryOn = DateTime.Now.AddDays(1),
            RevokedByIp = null
        });
        
        await _userManager.UpdateAsync(user);

        var newAccessToken = _tokenManager.GenerateAccessToken(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            SameSite = SameSiteMode.None,
            Secure = true
        };

        
        _httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

        return newAccessToken;
    }
}