using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Infrastructure.Services.Mail;

namespace Portfolio.Infrastructure;

public static class InfrastructureModule
{
    public static IServiceCollection RegisterInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.RegisterMailService(configuration);

        return services;
    }
}