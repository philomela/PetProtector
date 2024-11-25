using System.Text.Json;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;

namespace Application.Users.Commands.CreateUserYandex;

public class SignInVkCommand : IRequest<string>
{
    public string AccessToken;

    public string Email;
}

public class SignInVkCommandHandler : IRequestHandler<SignInVkCommand, string>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtTokenManager _tokenManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IHostEnvironment _environment;

    public SignInVkCommandHandler(
        UserManager<AppUser> userManager, 
        IJwtTokenManager tokenManager,
        IHttpContextAccessor httpContextAccessor,
        IHostEnvironment environment)
        => (_userManager, _tokenManager, _httpContextAccessor, _environment) = (userManager, tokenManager, httpContextAccessor, environment);
    
    public async Task<string> Handle(SignInVkCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.AccessToken) || string.IsNullOrEmpty(request.Email))
        {
            throw new BadRequestException("Token is missing");
        }
        // Запрос информации о пользователе
        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync(
            $"https://api.vk.com/method/users.get?access_token={request.AccessToken}&v=5.131");

        if (!response.IsSuccessStatusCode)
        {
            throw new BadRequestException("Failed to retrieve user information");
        }

        var userContent = await response.Content.ReadAsStringAsync();
        var userData = JsonSerializer.Deserialize<VKUserResponse>(userContent);

        if (userData?.Response == null || !userData.Response.Any())
        {
            throw new BadRequestException("User information is invalid");
        }
            
        var userVk = userData.Response.First();
            
        // Проверка, существует ли пользователь
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            user = new AppUser()
            {
                Email = request.Email,
                UserName = request.Email,
                FullName = userVk.FirstName,
                CreatedAt = DateTime.UtcNow.Date
            };

            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, "Hello46!");

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded && result.Errors.Any())
                throw new Exception("User was not created");
        }
        var token = _tokenManager.GenerateAccessToken(user);
        var refreshToken = _tokenManager.GenerateRefreshTokenAsync(user);
            
        return "true";
        
        

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

// Модель для запроса
public class VkTokenRequest
{
    public string AccessToken { get; set; }
    public string Email { get; set; }
}

// Модели ответа от VK
public class VKUserResponse
{
    public List<UserInfoVk> Response { get; set; }
}

public class UserInfoVk
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}