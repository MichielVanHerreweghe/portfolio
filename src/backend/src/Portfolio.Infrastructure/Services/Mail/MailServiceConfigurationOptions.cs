using System.ComponentModel.DataAnnotations;

namespace Portfolio.Infrastructure.Services.Mail;

public sealed class MailServiceConfigurationOptions
{
    public const string Section = "MailService";

    [Required] public string Host { get; init; } = default!;
    [Required] public int Port { get; init; }
    [Required] public string Username { get; init; } = default!;
    [Required] public string Password { get; init; } = default!;

    [Required] public string ToName { get; init; } = default!;
    [Required, EmailAddress] public string ToEmailAddress { get; init; } = default!;

    [Required] public string FromName { get; init; } = default!;
    [Required, EmailAddress] public string FromEmailAddress { get; init; } = default!;

    public bool UseSsl { get; init; } = true;
}