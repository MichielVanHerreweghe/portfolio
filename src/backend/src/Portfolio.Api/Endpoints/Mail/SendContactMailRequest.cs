using FastEndpoints;
using FluentValidation;

namespace Portfolio.Api.Endpoints.Mail;

public sealed record SendContactMailRequest(string SenderName,
    string SenderEmailAddress,
    string Message)
{
    public class RequestValidator : Validator<SendContactMailRequest>
    {
        public RequestValidator()
        {
            RuleFor(x => x.SenderName)
                .NotEmpty()
                .MinimumLength(6);

            RuleFor(x => x.SenderEmailAddress)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Message)
                .NotEmpty()
                .MinimumLength(10);
        }
    }
};