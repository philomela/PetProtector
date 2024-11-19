using System.Text.Json;
using Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace Infrastructure.Cache;

public class RedisCache : IRedisCache
{
    private readonly IDistributedCache _distributedCache;

    public RedisCache(IDistributedCache distributedCache) => _distributedCache = distributedCache;
    
    public async Task SetAsync<T>(string key, T value, CancellationToken cancellationToken, TimeSpan? expiration = null)
    {
        var serializedData = JsonSerializer.Serialize(value);
        await _distributedCache.SetStringAsync(key, serializedData, new DistributedCacheEntryOptions()
        {
            AbsoluteExpirationRelativeToNow = expiration,
        }, cancellationToken);
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken)
    {
        var data = await _distributedCache.GetStringAsync(key, cancellationToken);
        return string.IsNullOrEmpty(data) ? default : JsonSerializer.Deserialize<T>(data);
    }
}