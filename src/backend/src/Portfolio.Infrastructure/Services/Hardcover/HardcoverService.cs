using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Portfolio.Infrastructure.Services.Hardcover;

internal sealed class HardcoverService : IHardcoverService
{
    // status_id 2 == "Currently Reading" in Hardcover (1 = Want to Read, 3 = Read).
    private const string CurrentReadsQuery =
        """
        {
          me {
            user_books(where: { status_id: { _eq: 2 } }, order_by: { updated_at: desc }) {
              book {
                title
                slug
                image { url }
                contributions { author { name } }
              }
            }
          }
        }
        """;

    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;

    public HardcoverService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IReadOnlyList<CurrentRead>> GetCurrentReadsAsync(CancellationToken cancellationToken)
    {
        using HttpResponseMessage response = await _httpClient.PostAsJsonAsync(
            string.Empty,
            new GraphQlRequest(CurrentReadsQuery),
            SerializerOptions,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        GraphQlResponse? payload = await response.Content
            .ReadFromJsonAsync<GraphQlResponse>(SerializerOptions, cancellationToken);

        if (payload?.Errors is { Count: > 0 } errors)
            throw new InvalidOperationException(
                $"Hardcover GraphQL error: {string.Join("; ", errors.Select(e => e.Message))}");

        return payload?.Data?.Me?.FirstOrDefault()?.UserBooks?
            .Where(userBook => userBook.Book is not null)
            .Select(userBook => Map(userBook.Book!))
            .ToArray() ?? [];
    }

    private static CurrentRead Map(Book book) =>
        new(
            book.Title,
            book.Slug,
            book.Contributions?.FirstOrDefault()?.Author?.Name,
            book.Image?.Url);

    private sealed record GraphQlRequest(string Query);

    private sealed record GraphQlResponse(GraphQlData? Data, IReadOnlyList<GraphQlError>? Errors);

    private sealed record GraphQlError(string Message);

    private sealed record GraphQlData(IReadOnlyList<Me>? Me);

    private sealed record Me([property: JsonPropertyName("user_books")] IReadOnlyList<UserBook>? UserBooks);

    private sealed record UserBook(Book? Book);

    private sealed record Book(
        string Title,
        string? Slug,
        Image? Image,
        IReadOnlyList<Contribution>? Contributions);

    private sealed record Image(string? Url);

    private sealed record Contribution(Author? Author);

    private sealed record Author(string? Name);
}
