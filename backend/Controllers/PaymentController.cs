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
            amount = request.Amount * 100, // Paystack uses Cents/Kobo
            callback_url = "http://localhost:3000/dashboard", 
            metadata = new { card_number = request.CardNumber }
        };

        var response = await client.PostAsJsonAsync("https://api.paystack.co/transaction/initialize", paystackData);
        var result = await response.Content.ReadAsStringAsync();
        return Ok(result);
    }

    [HttpGet("verify/{reference}")]
    public async Task<IActionResult> Verify(string reference) {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _paystackSecret);

        var response = await client.GetAsync($"https://api.paystack.co/transaction/verify/{reference}");
        var result = await response.Content.ReadFromJsonAsync<dynamic>();

        if (result != null && result.GetProperty("data").GetProperty("status").GetString() == "success") {
            var data = result.GetProperty("data");
            string cardNumber = data.GetProperty("metadata").GetProperty("card_number").GetString()!;
            decimal amount = data.GetProperty("amount").GetDecimal() / 100;

            // UPDATE DATABASE
            var card = await _context.BusCards.FirstOrDefaultAsync(c => c.CardNumber == cardNumber);
            if (card != null) {
                card.Balance += amount;
                _context.Transactions.Add(new Transaction {
                    CardNumber = cardNumber,
                    Amount = amount,
                    Description = "Top-up via Paystack"
                });
                await _context.SaveChangesAsync();
                return Ok(new { status = "Success", newBalance = card.Balance });
            }
        }
        return BadRequest("Payment verification failed");
    }
}

public record TopUpRequest(string Email, decimal Amount, string CardNumber);