using Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Collar> Collars { get; set; }
    DbSet<Questionnaire> Questionnaires { get; set; }
    
    DbSet<Location> Locations { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
