using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignupApi.data;
using SignupApi.DTOs;
using SignupApi.Services;

namespace SignupApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    AppDbContext dbContext, 
    OtpService otpService, 
    EmailServices emailService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (request.Password != request.ConfirmPassword)
        {
            return BadRequest(new { message = "Passwords do not match." });
        }

        var busCard = await dbContext.BusCards
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.CardNumber.Trim() == request.CardNumber.Trim());

        if (busCard is null || busCard.User is null)
        {
            return BadRequest(new { message = "Card number not found." });
        }

        var user = busCard.User;

        if (!user.FullName.Trim().Equals(request.FullName.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Full name does not match our records." });
        }

        if (!user.Email.Trim().Equals(request.Email.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Email address does not match our records." });
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync();

        // Generate and Send OTP
        string otpCode = otpService.GenerateOtp(user.Email);
        await emailService.SendOtpEmailAsync(user.Email, otpCode);

        return Ok(new
        {
            message = "Registration successful. An OTP has been sent to your email for verification.",
            email = user.Email
        });
    }

    [HttpPost("verify-otp")]
    public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        bool isValid = otpService.ValidateOtp(request.Email, request.OtpCode);

        if (!isValid)
        {
            return BadRequest(new { message = "Invalid or expired OTP code." });
        }

        return Ok(new { message = "Email verified successfully! You can now log in." });
    }
}