using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models; 
using backend.DTOs;
using BCrypt.Net;

namespace backend.Controllers
{
    // [ApiController] + [Route] is the ASP.NET equivalent of writing:
    //   const router = express.Router();
    //   router.post('/login', ...);
    // and mounting it with app.use('/api/auth', router) in Express.
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        // ASP.NET's dependency injection automatically hands us a ready-to-use
        // AppDbContext here, the same way you might import a configured
        // Sequelize/Prisma client at the top of an Express route file.
        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            // Equivalent of: SELECT * FROM User WHERE Email = ? LIMIT 1
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                // Deliberately vague - don't reveal whether it was the email or password that was wrong.
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Compares the plain-text password from the frontend against the
            // hashed value stored in MySQL. Never compare plain-text to plain-text.
            bool passwordIsValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!passwordIsValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Equivalent of: SELECT * FROM BusCard WHERE UserId = ? LIMIT 1
            var busCard = await _context.BusCards
                .FirstOrDefaultAsync(b => b.UserId == user.Id);

            var response = new LoginResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                CardNumber = busCard?.CardNumber,
                Balance = busCard?.Balance ?? 0m
            };

            return Ok(response);
        }
    }
}