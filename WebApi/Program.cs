using System.Text.Json.Serialization;
using Application;
using Application.Common.Interfaces;
using Infrastructure;
using Microsoft.OpenApi.Models;
using WebApi.Configurations;
using WebApi.Filters;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddSingleton<IExecutionContextAccessor, ExecutionContextAccessor>();

builder.Services.AddControllers(options =>
 {
     options.Filters.Add<ApiExceptionFilterAttribute>();
 }).AddJsonOptions(o => o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
         builder => builder.WithOrigins("http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

var app = builder.Build();

app.UseRouting();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "PetProtector API V1");
        c.RoutePrefix = string.Empty;
    }
    );

    app.UseCors("CorsPolicy");
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");



app.Run();
