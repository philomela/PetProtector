using Application.Common.Interfaces;
using Domain.Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Identity.Jwt;

public class JwtTokenManager : IJwtTokenManager
{
    private readonly IConfiguration _configuration;

    public JwtTokenManager(IConfiguration configuration)
        => (_configuration) = (configuration);

    public string GenerateAccessToken(AppUser user)
    {
        if (user is null)
            throw new UnauthorizedAccessException();

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]
            ?? throw new Exception("Secret key was not found")); //Возможно unauthorize
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {   
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, "User"),
            }),
            Expires = DateTime.UtcNow.AddSeconds(10), //Вынести в appsettings
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshTokenAsync(AppUser user)
    {
        if (user is null)
            throw new UnauthorizedAccessException();

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]
            ?? throw new Exception("Secret key was not found")); //Возможно unauthorize
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Email),
            }),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal GetPrincipalFromToken(string accessToken)
    {
        var tokenValidationParameters = new TokenValidationParameters()
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(
                    _configuration["JwtSettings:Secret"]
                    ?? throw new Exception("Secret key was not found"))),
            //ValidIssuer = config["JwtSettings:Issuer"]
            //?? throw new Exception("Secret key was not found"),
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateLifetime = false,
            RequireExpirationTime = false,
            ValidateIssuerSigningKey = true
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            var principal = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out SecurityToken securityToken);
            
            if (principal is null)
                throw new UnauthorizedAccessException();

            return principal;
        }
        catch
        {
            throw new UnauthorizedAccessException();
        }
    }
}
