using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace Application.Users.Commands.CreateUserYandex;

public record SignInVkCommand : IRequest<(string, string)>
{
    public string State { get; set; } 
    
    public string Code { get; set; } 
    
    public string DeviceId { get; set; }
}

public class SignInVkCommandHandler : IRequestHandler<SignInVkCommand, (string, string)>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtTokenManager _tokenManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IHostEnvironment _environment;
    private readonly IRedisCache _cache;
    private readonly IConfiguration _configuration;

    public SignInVkCommandHandler(
        UserManager<AppUser> userManager,
        IJwtTokenManager tokenManager,
        IHttpContextAccessor httpContextAccessor,
        IRedisCache cache,
        IHostEnvironment environment,
        IConfiguration configuration)
        => (_userManager, _tokenManager, _httpContextAccessor, _environment, _cache, _configuration)
            = (userManager, tokenManager, httpContextAccessor, environment, cache, configuration);

    public async Task<(string, string)> Handle(SignInVkCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.State) || string.IsNullOrEmpty(request.Code))
        {

        }
        
        var cacheKeyState = request.State;
        var cacheItem = await _cache.GetAsync<CacheItem>(cacheKeyState, cancellationToken);

        if (cacheItem == null)
        {
            throw new BadRequestException("Invalid state");
        }

        // Удаляем state из Redis после проверки (одноразовый токен)
        //await _cache.RemoveAsync(cacheKey);

        // Выполняем запрос на получение токена
        var httpClient = new HttpClient();
  
        var tokenResponse = await httpClient.PostAsync("https://id.vk.com/oauth2/auth", new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                {"grant_type", "authorization_code"},
                { "client_id", "52743816" },
                { "client_secret", _configuration["Authentication:Yandex:ClientSecret"] },
                { "redirect_uri", "https://petprotector.ru/api/accounts/CallbackVk" },
                { "code", request.Code },
                { "code_verifier", cacheItem.CodeVerifier },
                {"device_id", request.DeviceId},
                {"state", request.State}
            }));
        
        if (!tokenResponse.IsSuccessStatusCode)
        {
            Console.WriteLine("Failed to exchange code for token");
        }

        // Обрабатываем успешный ответ
        var responseContent = await tokenResponse.Content.ReadAsStringAsync();
        var responseData = JsonConvert.DeserializeObject<VkTokenResponse>(responseContent);
        
        var userInfoResponse = await httpClient.PostAsync("https://id.vk.com/oauth2/user_info", new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                { "client_id", "52743816" },
                {"access_token", responseData.AccessToken},
            }));
        
        if (!userInfoResponse.IsSuccessStatusCode)
        {
            throw new BadRequestException("Failed to fetch user info");
        }
        
        var userInfoContent = await userInfoResponse.Content.ReadAsStringAsync();
        
        Console.WriteLine(userInfoContent);
        
        var userInfoData = JsonConvert.DeserializeObject<VkUserInfoResponse>(userInfoContent);

        if (userInfoData == null)
        {
            throw new BadRequestException("Failed to parse user info response");
        }

        Console.WriteLine("User is:" + userInfoData.User.Email);        
        var user = await _userManager.FindByEmailAsync(userInfoData.User.Email);

        if (user is null)
        {
            user = new AppUser()
            {
                Email = userInfoData.User.Email,
                UserName = userInfoData.User.Email,
                FullName = userInfoData.User.FirstName,
                CreatedAt = DateTime.UtcNow.Date,
                EmailConfirmed = true
            };

            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, "Hello46!");

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded && result.Errors.Any())
                throw new Exception("User was not created");
        }
        
        var cacheKeyStateResponse = request.State + cacheItem.CodeVerifier;
        await _cache.SetAsync(cacheKeyStateResponse, user, cancellationToken, TimeSpan.FromMinutes(1));
        
        return (cacheKeyStateResponse, cacheItem.RedirectUri);
    }
    
    public class VkUserInfoResponse
    {
        [JsonProperty("user")]
        public VkUserInfo User { get; set; }
    }

    public class VkUserInfo
    {
        [JsonProperty("user_id")]
        public long Id { get; set; }

        [JsonProperty("first_name")]
        public string FirstName { get; set; }

        [JsonProperty("last_name")]
        public string LastName { get; set; }
        
        [JsonProperty("email")]
        public string Email { get; set; }
    }


    public class VkTokenResponse
    {
        [JsonProperty("access_token")] public string AccessToken { get; set; }

        [JsonProperty("expires_in")] public int ExpiresIn { get; set; }

        [JsonProperty("user_id")] public long UserId { get; set; }

        [JsonProperty("email")] public string Email { get; set; } // Nullable, если email не запрашивался в scope
    }

    
    public class CacheItem
    {
        public string CodeVerifier { get; set; }
        public string RedirectUri { get; set; }
    }
}