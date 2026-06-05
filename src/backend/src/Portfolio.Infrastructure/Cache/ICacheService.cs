namespace Portfolio.Infrastructure.Cache;

public interface ICacheService
{
   public Task WriteAsync(string key,
      object value,
      CancellationToken cancellationToken = default,
      TimeSpan? absoluteExpirationTime = null,
      TimeSpan? slidingExpirationTime = null);

   public Task<TValue?> ReadAsync<TValue>(string key, CancellationToken cancellation = default);
}