using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Net.Http.Headers;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase {
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly string _paystackSecret = "sk_test_48522c9c21a16b1339015fcc3a604bc81ecbb54f"; // Get from Paystack dashboard

    public PaymentController(AppDbContext context, IConfiguration config) {
        _context = context;
        _config = config;
    }

    [HttpPost("initialize")]
    public async Task<IActionResult> Initialize([FromBody] TopUpRequest request) {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _paystackSecret);

        var paystackData = new {
            email = request.Email,
            amount = (int)(request.Amount * 100), // Paystack uses Cents/Kobo
            callback_url = "http://localhost:3002/dashboard", 
            metadata = new { 
                card_number = request.CardNumber,
                user_email = request.Email
            }
        };

        var response = await client.PostAsJsonAsync("https://api.paystack.co/transaction/initialize", paystackData);
        var resultString = await response.Content.ReadAsStringAsync();
        
        // Parse Paystack response so we can return structured JSON to frontend
        using var jsonDoc = JsonDocument.Parse(resultString);
        var root = jsonDoc.RootElement;
        
        if (root.GetProperty("status").GetBoolean())
        {
            var data = root.GetProperty("data");
            var authorizationUrl = data.GetProperty("authorization_url").GetString();
            var reference = data.GetProperty("reference").GetString();
            
            return Ok(new { 
                status = true,
                authorization_url = authorizationUrl,
                reference = reference
            });
        }

        return BadRequest(new { message = "Failed to initialize payment with Paystack." });
    }

    [HttpGet("verify/{reference}")]
    public async Task<IActionResult> Verify(string reference) {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _paystackSecret);

        var response = await client.GetAsync($"https://api.paystack.co/transaction/verify/{reference}");
        var resultString = await response.Content.ReadAsStringAsync();

        using var jsonDoc = JsonDocument.Parse(resultString);
        var root = jsonDoc.RootElement;

        if (root.GetProperty("status").GetBoolean())
        {
            var data = root.GetProperty("data");
            var paystackStatus = data.GetProperty("status").GetString();

            if (paystackStatus == "success")
            {
                string cardNumber = data.GetProperty("metadata").GetProperty("card_number").GetString()!;
                decimal amount = data.GetProperty("amount").GetDecimal() / 100;

                // 1. CHK IF TRANSACTION HAS ALREADY BEEN PROCESSED (THE FIX)
                var existingTx = await _context.Transactions
                    .FirstOrDefaultAsync(t => t.Description == $"Top-up via Paystack ({reference})");
                
                var card = await _context.BusCards.FirstOrDefaultAsync(c => c.CardNumber == cardNumber);
                if (card == null)
                {
                    return BadRequest(new { message = "Card not found in database." });
                }

                if (existingTx != null)
                {
                    // This reference was already handled! Return the current state safely without doubling.
                    return Ok(new { 
                        status = "Success", 
                        newBalance = card.Balance,
                        cardNumber = card.CardNumber,
                        amount = amount,
                        message = "Already processed previously."
                    });
                }

                // 2. UPDATE DATABASE ONLY IF IT IS NEW
                card.Balance += amount;
                _context.Transactions.Add(new Transaction
                {
                    CardNumber = cardNumber,
                    Amount = amount,
                    Type = TransactionType.Load,
                    TransactionDate = DateTime.Now,
                    // Appending the reference string inside description helps track uniquely
                    Description = $"Top-up via Paystack ({reference})" 
                });
                await _context.SaveChangesAsync();

                return Ok(new { 
                    status = "Success", 
                    newBalance = card.Balance,
                    cardNumber = card.CardNumber,
                    amount = amount
                });
            }
        }

        return BadRequest(new { message = "Payment verification failed." });
    }

}

public record TopUpRequest(string Email, decimal Amount, string CardNumber);
