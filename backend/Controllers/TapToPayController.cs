using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TapToPayController : ControllerBase
{
    private readonly AppDbContext _context;

    public TapToPayController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// POST /api/TapToPay/process-payment
    /// Process a tap-to-pay transaction (deduct fare from balance)
    /// Body: { email, amount }
    /// Response: { success, newBalance, transactionId, message }
    /// </summary>
    [HttpPost("process-payment")]
    public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentRequest request)
    {
        if (request.Amount <= 0)
            return BadRequest(new { message = "Invalid payment amount." });

        // Find user by email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.Trim().ToLower() == request.Email.Trim().ToLower());

        if (user == null)
            return BadRequest(new { message = "User not found." });

        // Find user's bus card
        var busCard = await _context.BusCards
            .FirstOrDefaultAsync(b => b.UserId == user.Id);

        if (busCard == null)
            return BadRequest(new { message = "Bus card not found." });

        // Check if sufficient balance
        if (busCard.Balance < request.Amount)
            return BadRequest(new { 
                message = "Insufficient balance. Please load funds first.",
                currentBalance = busCard.Balance,
                requiredAmount = request.Amount
            });

        // Deduct amount from balance
        busCard.Balance -= request.Amount;

        // Record transaction
        var transaction = new Transaction
        {
            CardNumber = busCard.CardNumber,
            Amount = request.Amount,
            Type = TransactionType.Trip,
            TransactionDate = DateTime.Now,
            Description = "Bus fare payment"
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Payment successful!",
            transactionId = transaction.Id,
            amount = request.Amount,
            newBalance = busCard.Balance,
            cardNumber = busCard.CardNumber,
            transactionDate = transaction.TransactionDate,
            description = transaction.Description
        });
    }
}

public class ProcessPaymentRequest
{
    public string Email { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}