using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;

namespace Application.Users.Commands.CreateUserYandex;

public class CreateUserYandexCommand : IRequest<string>
{
    public string Email;

    public string Name;
}

public class CreateUserYandexCommandHandler : IRequestHandler<CreateUserYandexCommand, string>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtTokenManager _tokenManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IHostEnvironment _environment;

    public CreateUserYandexCommandHandler(
        UserManager<AppUser> userManager, 
        IJwtTokenManager tokenManager,
        IHttpContextAccessor httpContextAccessor,
        IHostEnvironment environment)
        => (_userManager, _tokenManager, _httpContextAccessor, _environment) = (userManager, tokenManager, httpContextAccessor, environment);
    
    public async Task<string> Handle(CreateUserYandexCommand request, CancellationToken cancellationToken)
    {
        // Проверка, существует ли пользователь
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            user = new AppUser()
            {
                Email = request.Email,
                UserName = request.Email,
                FullName = request.Name,
                CreatedAt = DateTime.UtcNow.Date
            };

            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, "Hello46!");

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded && result.Errors.Any())
                throw new Exception("User was not created");
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