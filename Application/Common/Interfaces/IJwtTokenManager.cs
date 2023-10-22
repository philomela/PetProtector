using Domain.Core;
using System.Security.Claims;

namespace Application.Common.Interfaces;

public interface IJwtTokenManager
{
    public string GenerateAccessToken(AppUser user);

    public string GenerateRefreshTokenAsync(AppUser user);

    public ClaimsPrincipal GetPrincipalFromToken(string accessToken);
}
