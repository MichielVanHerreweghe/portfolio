using FastEndpoints;
using FastEndpoints.Swagger;

namespace Portfolio.Api.Extensions;

internal static class WebApplicationExtensions
{
    internal static WebApplication UseApplicationServices(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
            app.ConfigureDevelopmentServices();

        app.ConfigureFastEndpointsServices();

        return app;
    }

    private static void ConfigureDevelopmentServices(this WebApplication app)
    {
        app.UseSwaggerGen();
    }

    private static void ConfigureFastEndpointsServices(this WebApplication app)
    {
        app.UseFastEndpoints(configuration =>
        {
            configuration.Versioning.Prefix = "v";
            configuration.Versioning.PrependToRoute = true;
            configuration.Versioning.DefaultVersion = 1;
            configuration.Endpoints.RoutePrefix = "api";
        });
    }
}