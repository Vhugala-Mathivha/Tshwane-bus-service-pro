using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace backend.Services;

public class EmailServices(IConfiguration configuration)
{
    public async Task SendOtpEmailAsync(string toEmail, string otpCode)
    {
        string smtpServer = configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
        int smtpPort = int.Parse(configuration["EmailSettings:SmtpPort"] ?? "587");
        string senderEmail = configuration["EmailSettings:SenderEmail"] ?? "";
        string senderPassword = configuration["EmailSettings:SenderPassword"]?.Replace(" ", "") ?? "";

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Tshwane Bus Service", senderEmail));
        message.To.Add(new MailboxAddress("", toEmail));
        message.Subject = $"{otpCode} is your Tshwane Bus Service OTP";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $"""
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #0056b3;">Tshwane Bus Service Registration</h2>
                    <p>Your One-Time Password (OTP) for account verification is:</p>
                    <h1 style="color: #0056b3; letter-spacing: 4px;">{otpCode}</h1>
                    <p>This code is valid for <strong>5 minutes</strong>.</p>
                </div>
                """
        };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        
        // Connect using StartTls on Port 587
        await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(senderEmail, senderPassword);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}