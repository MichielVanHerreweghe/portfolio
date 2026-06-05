using Portfolio.Api.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services
    .RegisterApplicationServices(builder.Configuration);

WebApplication app = builder.Build();

app.UseApplicationServices();

app.Run();