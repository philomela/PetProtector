namespace Application.Locations.Queries.Dtos;

public record LocationDto
{
    public decimal Latitude { get; set; }
    
    public decimal Longitude { get; set; }
}