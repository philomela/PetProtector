﻿using System.Security.Claims;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

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
    private readonly IWebHostEnvironment _environment;

    public LogoutCommandHandler(UserManager<AppUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        IJwtTokenManager tokenManager,
        IWebHostEnvironment environment) 
        => (_userManager, _httpContextAccessor, _tokenManager, _environment)
    = (userManager, httpContextAccessor, tokenManager, environment);
    
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
            user.Tokens.FirstOrDefault(t => t.Token == currentRefreshToken && t.ExpiryOn >= DateTime.UtcNow);

        if (existingToken is null)
            throw new UnauthorizedAccessException();
        
        existingToken.RevokedByIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
        existingToken.RevokedOn = DateTime.UtcNow;
        existingToken.ExpiryOn = DateTime.UtcNow.AddDays(1);
        await _userManager.UpdateAsync(user);
        
        _httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", "", new CookieOptions
        {
            Expires = DateTime.UtcNow.AddDays(-1),
            HttpOnly = true,
            Secure = true,
            SameSite = _environment.IsProduction() ? SameSiteMode.Strict : SameSiteMode.None
        });

        return Unit.Value;
    }
}