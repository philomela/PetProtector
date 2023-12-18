using Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Percistance.Configurations;

public class CollarConfiguration : IEntityTypeConfiguration<Collar>
{
    public void Configure(EntityTypeBuilder<Collar> builder)
    {
        builder.ToTable("Collar");
        builder.HasOne(c => c.Questionnaire)
        .WithOne(q => q.Collar)
        .HasForeignKey<Questionnaire>(q => q.Id)
        .IsRequired(); //Можно будет убрать

        builder.HasKey(c => c.Id);    
        builder.Property(c => c.SecretKey).IsRequired();
        builder.Property(c => c.UserId);
    }
}