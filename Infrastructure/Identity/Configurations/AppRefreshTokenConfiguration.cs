using Domain.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Identity.Configurations;

public class AppRefreshTokenConfiguration : IEntityTypeConfiguration<AppRefreshToken>
{
    public void Configure(EntityTypeBuilder<AppRefreshToken> builder)
    {
        builder.ToTable(nameof(AppRefreshToken));
        builder.HasKey(t => t.Id);
        builder.HasOne(t => t.AppUser)
            .WithMany(u => u.Tokens)
            .HasForeignKey(t => t.UserId);
        builder.Property(t => t.CreatedByIp).IsRequired(false);
        builder.Property(t => t.CreatedOn);
        builder.Property(t => t.ExpiryOn);
        builder.Property(t => t.RevokedByIp).IsRequired(false);
        builder.Property(t => t.RevokedOn);
        builder.Property(t => t.Token).IsRequired(false);
        //Перепроверить правильность доменных ограничений сущностей бд, таких как not null или null
    }
}
