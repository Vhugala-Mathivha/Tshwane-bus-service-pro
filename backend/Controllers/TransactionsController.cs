using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/transactions?email=user@example.com&page=1&limit=20
    /// Returns all transactions for the user's bus card
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTransactions(
        [FromQuery] string email, 
        [FromQuery] int page = 1, 
        [FromQuery] int limit = 20)
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

        var query = _context.Transactions
            .Where(t => t.CardNumber == busCard.CardNumber)
            .OrderByDescending(t => t.TransactionDate);

        var total = await query.CountAsync();

        var transactions = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(t => new
            {
                id = t.Id,
                cardNumber = t.CardNumber,
                amount = t.Amount,
                type = t.Type.ToString(),
                transactionDate = t.TransactionDate,
                description = t.Description
            })
            .ToListAsync();

        return Ok(new
        {
            transactions,
            total,
            page,
            limit
        });
    }
}