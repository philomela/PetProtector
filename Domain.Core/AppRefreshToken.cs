namespace Domain.Core;

public class AppRefreshToken
{
    public long Id { get; set; }

    public string UserId { get; set; }

    public string Token { get; set; }

    public AppUser AppUser { get; set; }

    public DateTime ExpiryOn { get; set; }

    public DateTime CreatedOn { get; set; }

    public string CreatedByIp { get; set; }

    public DateTime RevokedOn { get; set; }

    public string RevokedByIp { get; set; }
}
