using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/card")]
public class CardController : ControllerBase
{
    private readonly AppDbContext _context;

    public CardController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/card/balance?email=user@example.com
    /// Returns the card balance and card number for the logged-in user
    /// </summary>
    [HttpGet("balance")]
    public async Task<IActionResult> GetBalance([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new { message = "Email is required." });

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.Trim().ToLower() == email.Trim().ToLower());

        if (user == null)
            return BadRequest(new { message = "User not found." });

        var busCard = await _context.BusCards
            .FirstOrDefaultAsync(b => b.UserId == user.Id);

        if (busCard == null)
            return BadRequest(new { message = "Card not found." });

        return Ok(new { cardNumber = busCard.CardNumber, balance = busCard.Balance });
    }

    /// <summary>
    /// POST /api/card/load-funds
    /// Body: { email, amount }
    /// Directly loads funds onto the user's bus card (bypasses Paystack for simplicity)
    /// </summary>
    [HttpPost("load-funds")]
    public async Task<IActionResult> LoadFunds([FromBody] LoadFundsRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });

        if (request.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than zero." });

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.Trim().ToLower() == request.Email.Trim().ToLower());

        if (user == null)
            return BadRequest(new { message = "User not found." });

        var busCard = await _context.BusCards
            .FirstOrDefaultAsync(b => b.UserId == user.Id);

        if (busCard == null)
            return BadRequest(new { message = "Card not found." });

        // Update balance
        busCard.Balance += request.Amount;

        // Record the transaction
        _context.Transactions.Add(new Transaction
        {
            CardNumber = busCard.CardNumber,
            Amount = request.Amount,
            Type = TransactionType.Load,
            TransactionDate = DateTime.Now,
            Description = "Funds loaded via card top-up"
        });

        await _context.SaveChangesAsync();

        return Ok(new { 
            message = "Funds loaded successfully.", 
            balance = busCard.Balance,
            cardNumber = busCard.CardNumber
        });
    }

    /// <summary>
    /// POST /api/card/pay-fare
    /// Body: { email, amount }
    /// Deducts fare from the user's bus card balance and logs a transaction
    /// </summary>
    [HttpPost("pay-fare")]
    public async Task<IActionResult> PayFare([FromBody] PayFareRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });

        if (request.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than zero." });

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.Trim().ToLower() == request.Email.Trim().ToLower());

        if (user == null)
            return BadRequest(new { message = "User not found." });

        var busCard = await _context.BusCards
            .FirstOrDefaultAsync(b => b.UserId == user.Id);

        if (busCard == null)
            return BadRequest(new { message = "Card not found." });

        if (busCard.Balance < request.Amount)
            return BadRequest(new { message = "Insufficient balance. Please load funds." });

        // Deduct fare balance
        busCard.Balance -= request.Amount;

        // Record the ride transaction
        _context.Transactions.Add(new Transaction
        {
            CardNumber = busCard.CardNumber,
            Amount = request.Amount,
            // Replace TransactionType.BusRide with your specific Enum member if named differently (e.g. Trip / Fare / Ride)
            Type = TransactionType.Trip, 
            TransactionDate = DateTime.Now,
            Description = "Bus Ride - Tap to Pay"
        });

        await _context.SaveChangesAsync();

        return Ok(new 
        { 
            message = "Payment successful.", 
            balance = busCard.Balance,
            cardNumber = busCard.CardNumber
        });
    }
}

public record LoadFundsRequest(string Email, decimal Amount);
public record PayFareRequest(string Email, decimal Amount);