using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ForgotPasswordController(
    AppDbContext dbContext,
    OtpService otpService,
    EmailServices emailService) : ControllerBase
{
    [HttpPost("lookup-id")]
    public async Task<IActionResult> LookupByIdNumber([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.IdNumber))
            return BadRequest(new { message = "ID Number is required." });

        // Look up user by their Id (which is the ID number)
        var user = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Id.Trim() == request.IdNumber.Trim());

        if (user == null)
            return BadRequest(new { message = "No account found with that ID Number." });

        // Check if user has finished registration (has password set)
        if (string.IsNullOrEmpty(user.PasswordHash))
            return BadRequest(new { message = "This account has not been registered yet. Please register first." });

        // Send OTP to user's email
        string otpCode = otpService.GenerateOtp(user.Email);
        Console.WriteLine($"\n=== Forgot Password OTP for {user.Email}: {otpCode} ===\n");

        try
        {
            await emailService.SendOtpEmailAsync(user.Email, otpCode);
        }
        catch
        {
            // If email fails, OTP is still cached in memory
        }

        return Ok(new { 
            message = "OTP sent to your registered email.", 
            email = user.Email 
        });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyForgotOtpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.OtpCode))
            return BadRequest(new { message = "Email and OTP code are required." });

        bool isValid = otpService.ValidateOtp(request.Email, request.OtpCode);

        if (!isValid)
            return BadRequest(new { message = "Invalid or expired OTP code." });

        return Ok(new { message = "OTP verified successfully.", email = request.Email });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        if (request.Password != request.ConfirmPassword)
            return BadRequest(new { message = "Passwords do not match." });

        if (request.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters long." });

        var user = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.Trim() == request.Email.Trim());

        if (user == null)
            return BadRequest(new { message = "User not found." });

        // Hash and update the new password
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync();

        return Ok(new { message = "Password has been reset successfully." });
    }
}