using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Portfolio.Infrastructure.Services.Mail;

internal static class ServiceCollectionExtensions
{
    internal static IServiceCollection RegisterMailService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<MailServiceConfigurationOptions>()
            .Bind(configuration.GetSection(MailServiceConfigurationOptions.Section))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddTransient<IMailService, MailService>();

        return services;
    }
}