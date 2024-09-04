using Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Percistance.Configurations;

public class QuestionnaireConfiguration : IEntityTypeConfiguration<Questionnaire>
{
    public void Configure(EntityTypeBuilder<Questionnaire> builder)
    {
        builder.ToTable("Questionnaire");
        builder.HasOne(q => q.Collar)
            .WithOne(c => c.Questionnaire)
            .HasForeignKey<Collar>(c => c.Id)
            .IsRequired(); //Можно будет убрать
        
        builder.HasKey(q => q.Id);
        builder.HasIndex(q => q.LinkQuestionnaire).IsUnique();
        builder.Property(q => q.PetsName).IsRequired(false);
        builder.Property(q => q.OwnersName).IsRequired(false);
        builder.Property(q => q.State).IsRequired();
        builder.Property(q => q.PhoneNumber).IsRequired(false);
    }
}