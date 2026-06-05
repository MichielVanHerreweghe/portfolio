using System.ComponentModel.DataAnnotations;

namespace Portfolio.Infrastructure.Cache;

public sealed class CacheConfigurationOptions
{
    public const string Section = "Cache";

    [Required] public string InstanceName { get; init; } = default!;
}