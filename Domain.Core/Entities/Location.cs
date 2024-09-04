using Domain.Core.Common;

namespace Domain.Core.Entities;

public class Location : BaseEntity
{
    public Guid Id { get; set; }

    public decimal Latitude { get; set; }
    
    public decimal Longitude { get; set; }

    public DateTime CreatedAt { get; set; }
    
    public Guid CollarId { get; set; }
    public Collar Collar { get; set; }
}