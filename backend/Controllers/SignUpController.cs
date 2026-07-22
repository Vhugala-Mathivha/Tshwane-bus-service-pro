using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SignUpController(
    AppDbContext dbContext, 
    OtpService otpService, 
    EmailServices emailService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (request.Password != request.ConfirmPassword)
            return BadRequest(new { message = "Passwords do not match." });

        var busCard = await dbContext.BusCards
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.CardNumber.Trim() == request.CardNumber.Trim());

        if (busCard is null || busCard.User is null)
            return BadRequest(new { message = "Card not found in our database." });

        var user = busCard.User;

        // Check if DB data matches what user typed
        if (!user.Email.Trim().Equals(request.Email.Trim(), StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Email does not match our records." });

        if (!user.FullName.Trim().Equals(request.FullName.Trim(), StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Full name does not match our records." });

        // Check if user is already registered (password already set)
        if (!string.IsNullOrEmpty(user.PasswordHash))
            return BadRequest(new { message = "This user is already registered. Please login." });

        // Hash password and Save
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync();

        return Ok(new { message = "Registration successful.", email = user.Email });
    }
}