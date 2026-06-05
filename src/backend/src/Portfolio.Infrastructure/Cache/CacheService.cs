using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace Portfolio.Infrastructure.Cache;

internal sealed class CacheService(IDistributedCache cache) : ICacheService
{
    public async Task WriteAsync(string key,
        object value,
        CancellationToken cancellationToken,
        TimeSpan? absoluteExpirationTime = null,
        TimeSpan? slidingExpirationTime = null)
    {
        DistributedCacheEntryOptions cacheOptions = new()
        {
            AbsoluteExpirationRelativeToNow = absoluteExpirationTime,
            SlidingExpiration = slidingExpirationTime
        };

        string serializedObject = JsonSerializer.Serialize(value);

        await cache.SetStringAsync(key,
            serializedObject,
            cacheOptions,
            cancellationToken);
    }

    public async Task<TValue?> ReadAsync<TValue>(string key, CancellationToken cancellationToken)
    {
        string? cachedObject = await cache.GetStringAsync(key, cancellationToken);

        if (cachedObject is null)
            return default;

        return JsonSerializer.Deserialize<TValue>(cachedObject);
    }
}