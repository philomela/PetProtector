using Application.Common.Interfaces;
using Domain.Core;
using Infrastructure.Percistance.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Percistance;

public class AppDbContext : DbContext, IAppDbContext
{
    public DbSet<Collar> Collars { get; set; }
    public DbSet<Questionnaire> Questionnaires { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //modelBuilder.ApplyConfiguration(new ParticipantConfiguration());
        modelBuilder.ApplyConfiguration(new CollarConfiguration());
        modelBuilder.ApplyConfiguration(new QuestionnaireConfiguration());
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        //await _mediator.DispatchDomainEvents(this);

        return await base.SaveChangesAsync(cancellationToken);
    }
}