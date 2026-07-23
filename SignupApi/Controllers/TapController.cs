using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignupApi.data;
using SignupApi.DTOs;
using SignupApi.Models;

namespace SignupApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TapController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet("card-details/{cardNumber}")]
    public async Task<IActionResult> GetCardDetails(string cardNumber)
    {
        var busCard = await dbContext.BusCards
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.CardNumber.Trim() == cardNumber.Trim());

        if (busCard is null)
        {
            return NotFound(new { message = "Bus card not found." });
        }

        return Ok(new CardDetailsResponse
        {
            CardNumber = busCard.CardNumber,
            CardHolderName = busCard.User?.FullName ?? "Card Holder",
            Balance = busCard.Balance,
            StandardFare = 15.00m
        });
    }

    [HttpPost("process-payment")]
    public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentRequest request)
    {
        var busCard = await dbContext.BusCards
            .FirstOrDefaultAsync(b => b.CardNumber.Trim() == request.CardNumber.Trim());

        if (busCard is null)
        {
            return NotFound(new { message = "Card number not found." });
        }

        if (busCard.Balance < request.Amount)
        {
            return BadRequest(new
            {
                message = "Insufficient funds. Please top up your card balance.",
                currentBalance = busCard.Balance,
                requiredAmount = request.Amount
            });
        }

        busCard.Balance -= request.Amount;

        var transaction = new Transaction
        {
            CardNumber = busCard.CardNumber,
            Amount = request.Amount,
            Type = "Trip",
            Description = "Tap-to-Pay Bus Fare",
            TransactionDate = DateTime.UtcNow
        };

        dbContext.Transactions.Add(transaction);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Payment successful! Gate access granted.",
            fareDeducted = request.Amount,
            newBalance = busCard.Balance,
            transactionId = transaction.Id,
            timestamp = transaction.TransactionDate
        });
    }
}