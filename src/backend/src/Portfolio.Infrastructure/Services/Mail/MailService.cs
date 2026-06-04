using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Portfolio.Infrastructure.Services.Mail;

internal sealed class MailService : IMailService
{
    private readonly MailServiceConfigurationOptions _options;

    public MailService(IOptions<MailServiceConfigurationOptions> options)
    {
        _options = options.Value;
    }

    public async Task SendMailAsync(string subject, string message,
        CancellationToken cancellationToken)
    {
        MimeMessage mail = CreateMail(subject, message);

        SecureSocketOptions socketOptions = _options.UseSsl
            ? SecureSocketOptions.SslOnConnect
            : SecureSocketOptions.StartTls;

        using SmtpClient mailClient = new();

        await mailClient.ConnectAsync(_options.Host, _options.Port, socketOptions, cancellationToken);
        await mailClient.AuthenticateAsync(_options.Username, _options.Password, cancellationToken);
        await mailClient.SendAsync(mail, cancellationToken);
        await mailClient.DisconnectAsync(true, cancellationToken);
    }

    private MimeMessage CreateMail(string subject, string message)
    {
        MimeMessage mail = new();

        mail.From
            .Add(new MailboxAddress(_options.FromName, _options.FromEmailAddress));

        mail.To
            .Add(new MailboxAddress(_options.ToName, _options.ToEmailAddress));

        mail.Subject = subject;

        mail.Body = new TextPart("plain")
        {
            Text = message
        };

        return mail;
    }
}