using Domain.Core;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.Authentication.Queries;

public record AuthenticateQuery : IRequest<string>
{
    public string Email { get; set; }

    public string Password { get; set; }
}

public record AuthenticationQueryHandler : IRequestHandler<AuthenticateQuery, string>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly PasswordHasher<AppUser> _passwordHaseher;
    private readonly IConfiguration _configuration;

    public AuthenticationQueryHandler(UserManager<AppUser> userManager, 
        PasswordHasher<AppUser> passwordHasher, 
        IConfiguration configuration) 
        => (_userManager, _configuration, _passwordHaseher) = (userManager, configuration, passwordHasher);

    public async Task<string> Handle(AuthenticateQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            throw new UnauthorizedAccessException();
        }

        var verifyedResult = _passwordHaseher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (PasswordVerificationResult.Success != verifyedResult)
        {
            throw new UnauthorizedAccessException();
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]
            ?? throw new Exception("Secret key was not found"));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Role, "User"),
                new Claim(ClaimTypes.Role, "Admin")
            }),
            Expires = DateTime.UtcNow.AddMinutes(3),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
