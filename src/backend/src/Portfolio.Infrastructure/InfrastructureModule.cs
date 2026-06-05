using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Portfolio.Infrastructure.Cache;
using Portfolio.Infrastructure.Services.Hardcover;
using Portfolio.Infrastructure.Services.Mail;

namespace Portfolio.Infrastructure;

public static class InfrastructureModule
{
    public static IServiceCollection RegisterInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.RegisterMailService(configuration);
        services.RegisterHardcoverService(configuration);
        services.RegisterCacheInfrastructure(configuration);
        
        return services;
    }

    private static void RegisterCacheInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<CacheConfigurationOptions>()
            .Bind(configuration.GetSection(CacheConfigurationOptions.Section))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddStackExchangeRedisCache(_ => { });

        services.AddOptions<RedisCacheOptions>()
            .Configure<IOptions<CacheConfigurationOptions>>((redis, cache) =>
            {
                redis.Configuration = configuration.GetConnectionString("cache");
                redis.InstanceName = cache.Value.InstanceName;
            });

        services.AddTransient<ICacheService, CacheService>();
    }
}