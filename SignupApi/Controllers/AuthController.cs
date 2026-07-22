using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignupApi.data;
using SignupApi.DTOs;
using SignupApi.Services; // Ensure OtpService / EmailServices are in this namespace

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
        // 0. Passwords match check
        if (request.Password != request.ConfirmPassword)
        {
            return BadRequest(new { message = "Passwords do not match." });
        }

        // 1. Check if the Card Number exists in the database
        var busCard = await dbContext.BusCards
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.CardNumber.Trim() == request.CardNumber.Trim());

        if (busCard is null || busCard.User is null)
        {
            return BadRequest(new { message = "Card number not found." });
        }

        var user = busCard.User;

        // 2. Verify Full Name matches DB record
        if (!user.FullName.Trim().Equals(request.FullName.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Full name does not match our records." });
        }

        // 3. Verify Email matches DB record
        if (!user.Email.Trim().Equals(request.Email.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Email address does not match our records." });
        }

        // 4. Hash the password and save to Database
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync();

        // 5. Generate and send OTP for email verification
        string otpCode = otpService.GenerateOtp(user.Email);
        await emailService.SendOtpEmailAsync(user.Email, otpCode);

        return Ok(new
        {
            message = "Registration successful. An OTP has been sent to your email for verification.",
            email = user.Email
        });
    }
}