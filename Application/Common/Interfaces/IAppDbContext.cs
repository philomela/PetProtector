using Domain.Core;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Questionnaire> Questionnaires { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
