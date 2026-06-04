using FastEndpoints;
using FastEndpoints.Swagger;
using Portfolio.Infrastructure;

namespace Portfolio.Api.Extensions;

internal static class ServiceCollectionExtensions
{
    internal static IServiceCollection RegisterApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.RegisterInfrastructure(configuration);
        services.RegisterFastEndpointsServices();

        return services;
    }

    private static void RegisterFastEndpointsServices(this IServiceCollection services)
    {
        services.AddFastEndpoints();
        services.SwaggerDocument();
    }
}