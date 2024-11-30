using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace Application.Authentication.Commands.Authenticate;

public record AuthenticateVkCommand : IRequest<string>
{
    public string State { get; set; } 
    
    public string RedirectUrl { get; set; }
}

public class AuthenticateVkCommandHandler : IRequestHandler<AuthenticateVkCommand, string>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtTokenManager _tokenManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IHostEnvironment _environment;
    private readonly IRedisCache _cache;
    private readonly IConfiguration _configuration;

    public AuthenticateVkCommandHandler(
        UserManager<AppUser> userManager,
        IJwtTokenManager tokenManager,
        IHttpContextAccessor httpContextAccessor,
        IRedisCache cache,
        IHostEnvironment environment,
        IConfiguration configuration)
        => (_userManager, _tokenManager, _httpContextAccessor, _environment, _cache, _configuration)
            = (userManager, tokenManager, httpContextAccessor, environment, cache, configuration);

    public async Task<string> Handle(AuthenticateVkCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.State) || string.IsNullOrEmpty(request.RedirectUrl))
        {
            throw new BadRequestException("Invalid request");
        }

        Console.WriteLine($"Started {nameof(AuthenticateVkCommand)}");
        
        var cacheKeyState = request.State;
        var userInfo = await _cache.GetAsync<AppUser>(cacheKeyState, cancellationToken);

        if (userInfo == null)
        {
            throw new BadRequestException("Invalid state");
        }

        
        
        var token = _tokenManager.GenerateAccessToken(userInfo);
        var refreshToken = _tokenManager.GenerateRefreshTokenAsync(userInfo);

        userInfo.Tokens.Add(new AppRefreshToken
        {
            UserId = userInfo.Id,
            CreatedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
            Token = refreshToken,
            CreatedOn = DateTime.UtcNow,
            ExpiryOn = DateTime.UtcNow.AddDays(1),
            RevokedByIp = null
        });

        await _userManager.UpdateAsync(userInfo);

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