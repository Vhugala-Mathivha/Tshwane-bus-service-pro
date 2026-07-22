using System.Net;
using System.Net.Mail;
namespace backend.Services;

public class EmailServices(IConfiguration configuration) {
    public async Task SendOtpEmailAsync(string toEmail, string otpCode) {
        // You will need to put real credentials in appsettings.json later
        string senderEmail = configuration["EmailSettings:SenderEmail"] ?? "your-email@gmail.com";
        string senderPassword = configuration["EmailSettings:SenderPassword"] ?? "your-app-password";

        var mailMessage = new MailMessage {
            From = new MailAddress(senderEmail, "Tshwane Bus Service"),
            Subject = "Your Registration OTP Code",
            Body = $"<h2>Tshwane Bus Service Verification</h2><p>Your OTP code is: <b>{otpCode}</b></p>",
            IsBodyHtml = true,
        };
        mailMessage.To.Add(toEmail);

        using var client = new SmtpClient("smtp.gmail.com", 587) {
            Credentials = new NetworkCredential(senderEmail, senderPassword),
            EnableSsl = true
        };
        await client.SendMailAsync(mailMessage);
    }
}