using Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Identity.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.ToTable(nameof(AppUser));
        builder.HasKey(u => u.Id);
        builder.HasMany(u => u.Tokens)
            .WithOne(t => t.AppUser)
            .HasForeignKey(t => t.UserId);
    }
}
