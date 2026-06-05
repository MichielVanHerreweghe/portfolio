namespace Portfolio.Infrastructure.Services.Hardcover;

public interface IHardcoverService
{
    public Task<IReadOnlyList<CurrentRead>> GetCurrentReadsAsync(CancellationToken cancellationToken = default);
}
