using System.Text.Json;
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

public record SignInVkCommand : IRequest<string>
{
    public string State { get; set; } 
    
    public string Code { get; set; } 
    
    public string DeviceId { get; set; }
}

public class SignInVkCommandHandler : IRequestHandler<SignInVkCommand, string>
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

    public async Task<string> Handle(SignInVkCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.State) || string.IsNullOrEmpty(request.Code))
        {

        }
        
        var cacheKey = request.State;
        var codeVerifier = await _cache.GetAsync<string>(cacheKey, cancellationToken);

        if (codeVerifier == null)
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
                { "code_verifier", codeVerifier },
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

        var userInfoResponse = await httpClient.GetAsync($"https://id.vk.com/oauth2/user_info?access_token={responseData.AccessToken}&client_id={request.DeviceId}");
        if (!userInfoResponse.IsSuccessStatusCode)
        {
            throw new BadRequestException("Failed to fetch user info");
        }

        var userInfoContent = await userInfoResponse.Content.ReadAsStringAsync();
        var userInfoData = JsonConvert.DeserializeObject<VkUserInfoResponse>(userInfoContent);

        if (userInfoData == null || userInfoData.Response == null || !userInfoData.Response.Any())
        {
            throw new BadRequestException("Failed to parse user info response");
        }

        var user = userInfoData.Response.First();

        // Логируем данные пользователя
        Console.WriteLine($"User ID: {user.Id}");
        Console.WriteLine($"Full Name: {user.FirstName} {user.LastName}");
        Console.WriteLine($"Email: {responseData.Email}");
        Console.WriteLine($"Email: {user.Email}");
        
        
        // Дополнительная обработка полученного токена
        return responseData.AccessToken;
    }

// Модель для запроса
    public class VkTokenRequest
    {
        public string AccessToken { get; set; }
        public string Email { get; set; }
    }

    public class VkUserInfoResponse
    {
        [JsonProperty("response")]
        public List<VkUserInfo> Response { get; set; }
    }

    public class VkUserInfo
    {
        [JsonProperty("id")]
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

    
    
}