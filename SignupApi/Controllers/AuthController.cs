using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignupApi.Data;
using SignupApi.DTOs;

namespace SignupApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly TshwaneDbContext _tshwaneDb;

    public AuthController(TshwaneDbContext tshwaneDb)
    {
        _tshwaneDb = tshwaneDb;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        // Check password confirmation
        if (request.Password != request.ConfirmPassword)
        {
            return BadRequest("Passwords do not match.");
        }

        // Search Tshwane database
        var resident = await _tshwaneDb.CardHolders.FirstOrDefaultAsync(r =>
     r.CardNumber == request.CardNumber);
        if (resident == null)
        {
            return BadRequest("Card number not found.");
        }

        if (resident.FullName.Trim().ToLower() != request.FullName.Trim().ToLower())
        {
            return BadRequest("Full name does not match our records.");
        }

        if (resident.Email.Trim().ToLower() != request.Email.Trim().ToLower())
        {
            return BadRequest("Email address does not match our records.");
        }

        return Ok(new
        {
            message = "Verification successful. Ready to send OTP."
        });
    }
}