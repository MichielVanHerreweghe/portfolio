using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Portfolio.Infrastructure.Services.Hardcover;

internal static class ServiceCollectionExtensions
{
    internal static IServiceCollection RegisterHardcoverService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<HardcoverServiceConfigurationOptions>()
            .Bind(configuration.GetSection(HardcoverServiceConfigurationOptions.Section))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddHttpClient<IHardcoverService, HardcoverService>((provider, client) =>
        {
            HardcoverServiceConfigurationOptions options = provider
                .GetRequiredService<IOptions<HardcoverServiceConfigurationOptions>>().Value;

            string token = options.ApiToken.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                ? options.ApiToken["Bearer ".Length..]
                : options.ApiToken;

            client.BaseAddress = new Uri(options.BaseUrl);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        });

        return services;
    }
}
