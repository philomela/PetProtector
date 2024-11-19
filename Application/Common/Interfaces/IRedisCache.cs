namespace Application.Common.Interfaces;

public interface IRedisCache
{
    Task SetAsync<T>(string key, T value, CancellationToken cancellationToken, TimeSpan? expiration = null);
    Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken);
}