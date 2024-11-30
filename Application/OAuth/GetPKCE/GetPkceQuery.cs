using System.Security.Cryptography;
using System.Text;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Application.OAuth.GetPKCE;

public record GetPkceQuery : IRequest<PkceVm>
{
    public string RedirectUri { get; set; }
}

public class GeneratePkceQueryHandler : IRequestHandler<GetPkceQuery, PkceVm>
{
    private readonly IRedisCache _cache; // Redis или другое хранилище
    private readonly IConfiguration _configuration;

    public GeneratePkceQueryHandler(IRedisCache cache, IConfiguration configuration)
    {
        _cache = cache;
        _configuration = configuration;
    }

    public async Task<PkceVm> Handle(GetPkceQuery request, CancellationToken cancellationToken)
    {
        var state = Guid.NewGuid().ToString() + "|" + request.RedirectUri;
        var codeVerifier = GenerateRandomString(64); // Длина от 43 до 128 символов
        var codeChallenge = GenerateCodeChallenge(codeVerifier);

        // Сохраняем данные в кэше для проверки на этапе обратного вызова
        await _cache.SetAsync(state, codeVerifier, cancellationToken, TimeSpan.FromMinutes(1));
        //Возможно стоит уменьшить время жизни в кеше.
        
        return new PkceVm
        {
            CodeChallenge = codeChallenge,
            State = state,
            RedirectUri = request.RedirectUri
        };
    }

    private string GenerateRandomString(int length)
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
        return new string(Enumerable.Repeat(chars, length).Select(s => s[new Random().Next(s.Length)]).ToArray());
    }

    private string GenerateCodeChallenge(string codeVerifier)
    {
        using var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(codeVerifier));
        return Convert.ToBase64String(hash).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }
}