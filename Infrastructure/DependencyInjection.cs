using System.Security.Claims;
using Application.Common.Interfaces;
using Domain.Core.Entities;
using Infrastructure.Identity;
using Infrastructure.Identity.Jwt;
using Infrastructure.Percistance;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using Infrastructure.Cache;
using Infrastructure.EmailSender.Configurations;
using Infrastructure.Percistance.Interceptors;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Options;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        var connectionString = config["DbConnection"];

        services.AddScoped<ISaveChangesInterceptor, DomainEventDispatcher>();
        
        services.AddDbContext<AuthDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddIdentity<AppUser, IdentityRole>(options =>
        {
            options.Tokens.PasswordResetTokenProvider = "PetProtector";
            options.Tokens.EmailConfirmationTokenProvider = "PetProtector";
        }).AddEntityFrameworkStores<AuthDbContext>()
        .AddTokenProvider<DataProtectorTokenProvider<AppUser>>("PetProtector");

        services.AddAuthentication(options =>
        {
            options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
           // options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = "Yandex"; // Используется для вызова Yandex OAuth
        }).AddCookie()
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, cfg =>
        {
            cfg.TokenValidationParameters = new TokenValidationParameters()
            {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(
                    config["JwtSettings:Secret"]
                    ?? throw new Exception("Secret key was not found"))),
                //ValidIssuer = config["JwtSettings:Issuer"]
                    //?? throw new Exception("Secret key was not found"),
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateLifetime = true,
                RequireExpirationTime = true,
                ValidateIssuerSigningKey = true
            };
        }).AddOAuth("Yandex", options =>
        {
            options.ClientId = config["Authentication:Yandex:ClientId"];
            options.ClientSecret = config["Authentication:Yandex:ClientSecret"];
            options.CallbackPath = new PathString("/yandex-callback");

            options.AuthorizationEndpoint = "https://oauth.yandex.ru/authorize";
            options.TokenEndpoint = "https://oauth.yandex.ru/token";
            options.UserInformationEndpoint = "https://login.yandex.ru/info";

            options.SaveTokens = true; // Сохраняем токены

            //options.Scope.Add("email");
            
            options.Events.OnCreatingTicket = async context =>
            {
                var request = new HttpRequestMessage(HttpMethod.Get, options.UserInformationEndpoint);
                request.Headers.Add("Authorization", "Bearer " + context.AccessToken);

                var response = await context.Backchannel.SendAsync(request, context.HttpContext.RequestAborted);
                response.EnsureSuccessStatusCode();

                var user = JsonDocument.Parse(await response.Content.ReadAsStringAsync()).RootElement;

                var email = user.GetString("default_email");
                var name = user.GetString("first_name");

                if (!string.IsNullOrEmpty(email))
                {
                    context.Identity.AddClaim(new Claim(ClaimTypes.Email, email));
                }

                if (!string.IsNullOrEmpty(name))
                {
                    context.Identity.AddClaim(new Claim(ClaimTypes.Name, name));
                }
            };
        });

        services.AddAuthorization(options =>
            options.AddPolicy("UserIdPolicy", policy => policy.RequireRole("User")));
        

        services.AddDbContext<AppDbContext>((provider, options) =>
        {
            options.AddInterceptors(provider.GetServices<ISaveChangesInterceptor>());
            options.UseSqlServer(connectionString);
        });

        services.AddScoped<IAppDbContext>(provider => provider.GetService<AppDbContext>());
        services.AddScoped<ApplicationDbContextInitialiser>();
        
        services.AddStackExchangeRedisCache(options =>
        {
            var conn = config["RedisConnection"];
            options.Configuration = config["RedisConnection"];
        });

        services.AddScoped<IRedisCache, RedisCache>();
        
        services.AddTransient<IJwtTokenManager, JwtTokenManager>();
        
        services.Configure<EmailSenderConfiguration>(config.GetSection("SmtpConfigurations"));
        services.AddSingleton<EmailSenderConfiguration>(provider => provider.GetRequiredService<IOptions<EmailSenderConfiguration>>().Value);
        services.AddTransient<IEmailSender, EmailSender.EmailSender>();

        return services;
    }
}
