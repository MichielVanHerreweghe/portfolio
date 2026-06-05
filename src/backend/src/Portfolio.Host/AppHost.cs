IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

IResourceBuilder<RedisResource> cache = builder.AddRedis("cache")
    .WithDataVolume();

builder.AddProject<Projects.Portfolio_Api>("api")
    .WithReference(cache)
    .WaitFor(cache);

builder.Build().Run();
