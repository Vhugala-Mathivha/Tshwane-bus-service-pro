using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models; 
using backend.DTOs;
using backend.Services; // Imported to access OtpService & EmailServices
using BCrypt.Net;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly OtpService _otpService;
        private readonly EmailServices _emailService;

        // Inject OtpService and EmailServices into AuthController
        public AuthController(
            AppDbContext context, 
            OtpService otpService, 
            EmailServices emailService)
        {
            _context = context;
            _otpService = otpService;
            _emailService = emailService;
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            bool passwordIsValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!passwordIsValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

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

        /// <summary>
        /// POST /api/auth/forgot-password-id
        /// Body: { idNumber }
        /// Checks if user exists by SA ID Number, generates an OTP, and dispatches it via email.
        /// </summary>
        [HttpPost("forgot-password-id")]
        public async Task<IActionResult> ForgotPasswordById([FromBody] ForgotPasswordIdRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.IdNumber))
            {
                return BadRequest(new { message = "ID Number is required." });
            }

            // Query DB by ID Number (Primary Key: Id)
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.IdNumber.Trim());

            if (user == null)
            {
                return NotFound(new { message = "No account found with this ID Number." });
            }

            // 1. Generate OTP in memory using OtpService
            string otpCode = _otpService.GenerateOtp(user.Email);
            
            // 2. Log OTP to terminal console for development/testing
            Console.WriteLine($"\n=== Forgot Password OTP for {user.Email}: {otpCode} ===\n");
            
            // 3. Send email with the OTP code
            try
            {
                await _emailService.SendOtpEmailAsync(user.Email, otpCode);
            }
            catch
            {
                // If email dispatch fails, the OTP is still cached in memory for validation
            }

            // Get card information for session state
            var busCard = await _context.BusCards
                .FirstOrDefaultAsync(b => b.UserId == user.Id);

            return Ok(new
            {
                message = "OTP sent successfully to your registered email.",
                email = user.Email,
                userId = user.Id,
                fullName = user.FullName,
                cardNumber = busCard?.CardNumber,
                balance = busCard?.Balance ?? 0m
            });
        }

        public record ForgotPasswordIdRequest(string IdNumber);
    }
}