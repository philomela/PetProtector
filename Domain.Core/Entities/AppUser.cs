using Microsoft.AspNetCore.Identity;

namespace Domain.Core.Entities;

public class AppUser : IdentityUser
{
    public string FullName { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<AppRefreshToken> Tokens { get; } = new List<AppRefreshToken>();
}
