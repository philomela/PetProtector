using Domain.Core.Entities;
using Domain.Core.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Percistance;

public class ApplicationDbContextInitialiser
{
    private readonly AppDbContext _appDbContext;
    private readonly UserManager<AppUser> _userManager;

    public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger,
        AppDbContext appDbContext, UserManager<AppUser> userManager)
    {
        _appDbContext = appDbContext;
        _userManager = userManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            if (_appDbContext.Database.IsSqlServer())
            {
                await _appDbContext.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while initialising the database. {ex}");
            //_logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            // _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        var user = new AppUser
        {
            Email = "romaphilomela@yandex.ru",
            UserName = "romaphilomela@yandex.ru",
            FullName = "Roman",
            CreatedAt = DateTime.UtcNow.Date,
            EmailConfirmed = true
        };

        //Добавить админа и роли пользователя

        if (_userManager.Users.All(u => u.Email != user.Email))
        {
            var result = await _userManager.CreateAsync(user, "Roman1994!");
            
            if (!result.Succeeded && result.Errors.Any())
                throw new Exception("User was not created");
        }

        if (!_appDbContext.Collars.Any())
        {
            var Id = Guid.NewGuid();
            var collar = new Collar()
            {
                Id = Id,
                SecretKey = "petprotector",
                Questionnaire = new Questionnaire()
                {
                    Id = Id,
                    LinkQuestionnaire = Guid.NewGuid(),
                    State = QuestionnaireStates.WaitingFilling,
                },
            
            };
            await _appDbContext.Collars.AddAsync(collar);
        }

        await _appDbContext.SaveChangesAsync();
    }
}