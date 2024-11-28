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

        // Извлекаем сохранённый codeVerifier из Redis по state
        var cacheKey = request.State;
        var cachedData = await _cache.GetAsync<string>(cacheKey, cancellationToken);

        Console.WriteLine("CachedData:" + " " + cachedData);

        if (cachedData == null)
        {

        }

        // Преобразуем кэшированные данные
        var codeVerifier = cachedData;

        // Удаляем state из Redis после проверки (одноразовый токен)
        //await _cache.RemoveAsync(cacheKey);

        // Выполняем запрос на получение токена
        var httpClient = new HttpClient();
        var tokenResponse = await httpClient.PostAsync("https://oauth.vk.com/access_token", new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                { "client_id", "52743816" },
                { "client_secret", _configuration["Authentication:Yandex:ClientSecret"] },
                { "redirect_uri", "https://petprotector.ru/api/accounts/CallbackVk" },
                { "code", request.Code },
                { "code_verifier", codeVerifier }
            }));

        if (!tokenResponse.IsSuccessStatusCode)
        {
            Console.WriteLine("Failed to exchange code for token");
        }

        // Обрабатываем успешный ответ
        var responseContent = await tokenResponse.Content.ReadAsStringAsync();
        Console.WriteLine(responseContent);
        var responseData = JsonConvert.DeserializeObject<VkTokenResponse>(responseContent);
        Console.WriteLine(responseData);

        // Дополнительная обработка полученного токена
        return responseData.AccessToken;
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


    public class VkTokenResponse
    {
        [JsonProperty("access_token")] public string AccessToken { get; set; }

        [JsonProperty("expires_in")] public int ExpiresIn { get; set; }

        [JsonProperty("user_id")] public long UserId { get; set; }

        [JsonProperty("email")] public string Email { get; set; } // Nullable, если email не запрашивался в scope
    }

}