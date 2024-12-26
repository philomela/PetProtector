using Microsoft.AspNetCore.Identity;
using Domain.Core.Common;

namespace Domain.Core.Entities;

public class AppUser : IdentityUser //Разобраться как для пользователя реализовать добавление доменных событий, мб применить какой-то декоратор
{
    public string FullName { get; set; }

    public DateTime CreatedAt { get; set; }
    
    public string Avatar {get; set;}
    
    public ICollection<AppRefreshToken> Tokens { get; } = new List<AppRefreshToken>();
}
