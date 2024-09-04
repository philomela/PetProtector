using Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Percistance.Configurations;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        builder.ToTable("Location");
        builder.Property(l => l.Latitude)
            .HasColumnType("decimal(9, 6)");
        builder.Property(l => l.Longitude)
            .HasColumnType("decimal(9, 6)");
        builder.Property(l => l.CreatedAt);
    }
}