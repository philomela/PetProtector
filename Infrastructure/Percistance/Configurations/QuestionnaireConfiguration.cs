using Domain.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Percistance.Configurations;

public class QuestionnaireConfiguration : IEntityTypeConfiguration<Questionnaire>
{
    public void Configure(EntityTypeBuilder<Questionnaire> builder)
    {
        builder.HasKey(q => q.Id);
        builder.Property(q => q.PetsName);
        builder.Property(q => q.OwnersName);
        builder.Property(q => q.SecretKey);
        builder.Property(q => q.State);
        builder.Property(q => q.PhoneNumber);
    }
}
