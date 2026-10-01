using Microsoft.AspNetCore.Identity.UI.Services;
using MailKit.Net.Smtp;
using MailKit;
using MimeKit;


namespace backend.Services;

public class EmailSender(ILogger<EmailSender> logger) : IEmailSender
{
    public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
    {
        await Execute(subject, htmlMessage, toEmail);
    }

    // NOTE: it recommended to not use the SmtpClient class from the docs & to use MailKit. I'll need to implement the sending of emails using this in the future. See "https://learn.microsoft.com/en-us/dotnet/api/system.net.mail.smtpclient?view=net-10.0"
    private async Task Execute(string subject, string htmlMessage, string toEmail)
    {
        var email = new MimeMessage();

        email.From.Add(new MailboxAddress("No Reply [CEI]", "noreply@cei.org"));
        email.To.Add(new MailboxAddress("", toEmail));
        email.Subject = subject;

        email.Body = new TextPart("html")
        {
            Text = htmlMessage
        };

        using var smtp = new SmtpClient();
        
        await smtp.ConnectAsync("mailpit", 1025);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
        
        logger.LogInformation("Email sent successfully.");
    }

}