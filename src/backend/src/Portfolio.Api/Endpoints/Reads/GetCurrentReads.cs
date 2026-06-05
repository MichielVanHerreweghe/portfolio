using FastEndpoints;
using Portfolio.Infrastructure.Cache;
using Portfolio.Infrastructure.Services.Hardcover;

namespace Portfolio.Api.Endpoints.Reads;

internal sealed class GetCurrentReads(IHardcoverService hardcoverService, ICacheService cacheService) : EndpointWithoutRequest<IReadOnlyList<CurrentRead>>
{
    private readonly string _cacheKey = "reads:current";
    private readonly TimeSpan _absoluteExpirationTime = TimeSpan.FromHours(6);

    public override void Configure()
    {
        Get("reads/current");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            IReadOnlyList<CurrentRead> currentReads = await FetchCurrentReads(ct);

            await Send.OkAsync(currentReads, ct);
        }
        catch (Exception ex)
        {
            AddError(ex.Message);
            await Send.ErrorsAsync(500, ct);
        }
    }

    private async Task<IReadOnlyList<CurrentRead>> FetchCurrentReads(CancellationToken cancellationToken)
    {
        IReadOnlyList<CurrentRead>? currentReads = await cacheService.ReadAsync<IReadOnlyList<CurrentRead>>(_cacheKey, cancellationToken);

        if (currentReads is not null)
            return currentReads;
        
        currentReads = await hardcoverService.GetCurrentReadsAsync(cancellationToken);

        await cacheService.WriteAsync(_cacheKey,
            currentReads,
            cancellationToken,
            _absoluteExpirationTime);

        return currentReads;
    }
}
