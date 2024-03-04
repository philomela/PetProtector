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
using Infrastructure.EmailSender.Configurations;
using Infrastructure.Percistance.Interceptors;
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
        }).AddEntityFrameworkStores<AuthDbContext>()
        .AddTokenProvider<DataProtectorTokenProvider<AppUser>>("PetProtector");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, cfg =>
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
        
        services.AddTransient<IJwtTokenManager, JwtTokenManager>();
        
        //services.Configure<EmailSenderConfiguration>(config.GetSection("SmtpConfigurations"));
        //services.AddSingleton<EmailSenderConfiguration>(provider => provider.GetRequiredService<IOptions<EmailSenderConfiguration>>().Value);
        //services.AddTransient<IEmailSender, EmailSender.EmailSender>();

        return services;
    }
}
