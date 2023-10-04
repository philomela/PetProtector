using Domain.Core;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IAuthDbContext
{
    public DbSet<AppUser> AppUser { get; set; }
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
