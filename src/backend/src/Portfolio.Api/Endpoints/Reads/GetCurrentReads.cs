using FastEndpoints;
using Portfolio.Infrastructure.Services.Hardcover;

namespace Portfolio.Api.Endpoints.Reads;

internal sealed class GetCurrentReads(IHardcoverService hardcoverService) : EndpointWithoutRequest<IReadOnlyList<CurrentRead>>
{
    public override void Configure()
    {
        Get("reads/current");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            IReadOnlyList<CurrentRead> currentReads = await hardcoverService.GetCurrentReadsAsync(ct);

            await Send.OkAsync(currentReads, ct);
        }
        catch (Exception ex)
        {
            AddError(ex.Message);
            await Send.ErrorsAsync(500, ct);
        }
    }
}
