using Domain.Core;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IAuthDbContext
{
    public DbSet<AppUser> AppUsers { get; set; }

    public DbSet<AppRefreshToken> AppTokens { get; set; }
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
