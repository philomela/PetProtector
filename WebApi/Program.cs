﻿using System.Text.Json.Serialization;
using Application;
using Application.Common.Interfaces;
using Infrastructure;
using Infrastructure.Percistance;
using Microsoft.OpenApi.Models;
using WebApi;
using WebApi.Configurations;
using WebApi.Filters;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddSingleton<IExecutionContextAccessor, ExecutionContextAccessor>();
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers(options => { options.Filters.Add<ApiExceptionFilterAttribute>(); })
    .AddJsonOptions(o => o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
//builder.Services.AddControllersWithViews();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PetProtector API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
    });

    c.OperationFilter<AuthResponsesOperationFilter>();
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddRateLimiters();

builder.Services.AddCors(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        // Для локальной разработки
        options.AddPolicy("CorsPolicy",
            builder => builder.WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
    }
    else
    {
        // Для продакшн окружения
        options.AddPolicy("CorsPolicy",
            builder => builder.WithOrigins("https://petprotector.ru")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
    }
});

var app = builder.Build();

app.UseRouting();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
    await initialiser.InitialiseAsync();
    await initialiser.SeedAsync();
}

if (builder.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "PetProtector API V1");
            c.RoutePrefix = string.Empty;
        }
    );
}

app.UseCors("CorsPolicy");
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");


app.Run();