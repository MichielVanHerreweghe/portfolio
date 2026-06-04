using Portfolio.Infrastructure.Services.Mail;
using FastEndpoints;

namespace Portfolio.Api.Endpoints.Mail;

internal sealed class SendContactMail(IMailService mailService) : Endpoint<SendContactMailRequest>
{
    private readonly string _subject = "New contact message from portfolio";

    public override void Configure()
    {
        Post("mail/contact");
        AllowAnonymous();
    }

    public override async Task HandleAsync(SendContactMailRequest req, CancellationToken ct)
    {
        try
        {
            await mailService.SendMailAsync(_subject,
                ConstructMessage(req.SenderName, req.SenderEmailAddress, req.Message),
                ct);

            await Send.OkAsync(cancellation: ct);
        }
        catch (Exception ex)
        {
            AddError(ex.Message);
            await Send.ErrorsAsync(500, ct);
        }
    }

    private string ConstructMessage(string senderName, string senderEmailAddress, string senderMessage)
    {
        string message = $@"""
        _____________________
         CONTACT INFORMATION
        ---------------------
        Name: {senderName}
        Email: {senderEmailAddress}

        _________
         MESSAGE
        ---------
        {senderMessage}
        """;

        return message;
    }
}