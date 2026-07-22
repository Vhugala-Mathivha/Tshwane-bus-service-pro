using System.Net;
using System.Net.Mail;

namespace SignupApi.Services;

public class EmailServices(IConfiguration configuration)
{
    public async Task SendOtpEmailAsync(string toEmail, string otpCode)
    {
        // Read SMTP settings from appsettings.json
        string smtpServer = configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
        int smtpPort = int.Parse(configuration["EmailSettings:SmtpPort"] ?? "587");
        string senderEmail = configuration["EmailSettings:SenderEmail"] ?? "";
        string senderPassword = configuration["EmailSettings:SenderPassword"] ?? "";

        var mailMessage = new MailMessage
        {
            From = new MailAddress(senderEmail, "Tshwane Bus Service"),
            Subject = "Your Registration OTP Code",
            Body = $"""
                <h2>Tshwane Bus Service Registration</h2>
                <p>Your One-Time Password (OTP) for account verification is:</p>
                <h1 style="color: #0056b3;">{otpCode}</h1>
                <p>This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
                """,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(toEmail);

        using var client = new SmtpClient(smtpServer, smtpPort)
        {
            Credentials = new NetworkCredential(senderEmail, senderPassword),
            EnableSsl = true
        };

        await client.SendMailAsync(mailMessage);
    }
}