using System.ComponentModel.DataAnnotations;

namespace Portfolio.Infrastructure.Services.Hardcover;

public sealed class HardcoverServiceConfigurationOptions
{
    public const string Section = "HardcoverService";

    [Required, Url] public string BaseUrl { get; init; } = "https://api.hardcover.app/v1/graphql";

    [Required] public string ApiToken { get; init; } = default!;
}
