namespace Portfolio.Infrastructure.Services.Mail;

public interface IMailService
{
    public Task SendMailAsync(string subject, string message, CancellationToken cancellationToken = default);
}