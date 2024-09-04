using System.Security.Claims;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Authentication.Commands.Logout;

public record LogoutCommand : IRequest<Unit>
{
    public string Token { get; set; }
}

internal record LogoutCommandHandler : IRequestHandler<LogoutCommand, Unit>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IJwtTokenManager _tokenManager;

    public LogoutCommandHandler(UserManager<AppUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        IJwtTokenManager tokenManager) => (_userManager, _httpContextAccessor, _tokenManager)
    = (userManager, httpContextAccessor, tokenManager);
    
    public async Task<Unit> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var currentRefreshToken = _httpContextAccessor?.HttpContext?.Request.Cookies["refreshToken"]
                                  ?? throw new BadRequestException("Refresh token not found"); //todo: пересмотреть, возможно другое исключение

        var principal = _tokenManager.GetPrincipalFromToken(request.Token);
        
        var emailClaim = principal.FindFirst(ClaimTypes.Email)?.Value 
                         ?? throw new UnauthorizedAccessException();

        var user = await _userManager.Users.Include(x => x.Tokens)
            .FirstOrDefaultAsync(x => x.Email == emailClaim, cancellationToken);

        if (user is null || !user.EmailConfirmed) //Перепроверить условие, юзер должен быть акцептован
            throw new UnauthorizedAccessException();

        var existingToken =
            user.Tokens.FirstOrDefault(t => t.Token == currentRefreshToken && t.ExpiryOn >= DateTime.Now);

        if (existingToken is null)
            throw new UnauthorizedAccessException();
        
        existingToken.RevokedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
        existingToken.RevokedOn = DateTime.Now;
        existingToken.ExpiryOn = DateTime.Now.AddDays(1);
        await _userManager.UpdateAsync(user);
        
        _httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", "", new CookieOptions
        {
            Expires = DateTime.Now.AddDays(-1),
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true
        });

        return Unit.Value;
    }
}