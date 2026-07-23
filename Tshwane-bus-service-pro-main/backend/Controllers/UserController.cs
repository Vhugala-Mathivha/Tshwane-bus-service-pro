using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/user/profile?email=user@example.com
    /// Returns the user's profile information
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new { message = "Email is required." });

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.Trim().ToLower() == email.Trim().ToLower());

        if (user == null)
            return BadRequest(new { message = "User not found." });

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            createdAt = user.CreatedAt
        });
    }
}