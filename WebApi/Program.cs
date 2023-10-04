using Application;
using Infrastructure;
using Application.Questionnaires.Queries;
using Domain.Core;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Questionnaires.Commands.UpdateQuestionnaire;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

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

app.MapGet("/questionnarie/edit/{id}", async ([FromRoute] string id,
                                         [FromServices] IMediator mediator) =>
{
    return await mediator.Send(new UpdateQuestionnaireCommand());
}).RequireAuthorization("UserIdPolicy");

app.MapGet("/questionnarie/{id}", async ([FromRoute] string id,
                                         [FromServices] IMediator mediator) =>
{
    return await mediator.Send(new GetQuestionnaireQuery());
}).RequireAuthorization("UserIdPolicy");


app.MapPost("/login/{id}", async ([FromRoute] string id,
                             [FromServices] IMediator mediator, 
                             [FromServices] UserManager<AppUser> userManager,
                                            SignInManager<AppUser> signInManager) =>
{
    var isValid = Guid.TryParse(id, out Guid userId);
    if (!isValid) return Results.BadRequest();

    //var user = await userManager.FindByIdAsync(userId.ToString());
    //if (user == null)
    //    return Results.Unauthorized();

    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"]
        ?? throw new Exception("Secret key was not found"));
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
                new Claim("Id", id.ToString()),
                new Claim(ClaimTypes.Role, "Administrator")
            }),
        Expires = DateTime.UtcNow.AddDays(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);
    return Results.Ok(new { token });
});


app.Run();
