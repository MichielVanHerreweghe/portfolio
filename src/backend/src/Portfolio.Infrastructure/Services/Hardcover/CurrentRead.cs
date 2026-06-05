namespace Portfolio.Infrastructure.Services.Hardcover;

public sealed record CurrentRead(
    string Title,
    string? Slug,
    string? Author,
    string? CoverImageUrl);
