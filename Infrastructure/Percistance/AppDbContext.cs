using System.Reflection;
using Application.Common.Interfaces;
using Domain.Core.Entities;
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
        modelBuilder.ApplyConfiguration(new CollarConfiguration());
        modelBuilder.ApplyConfiguration(new QuestionnaireConfiguration());
        
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }
}