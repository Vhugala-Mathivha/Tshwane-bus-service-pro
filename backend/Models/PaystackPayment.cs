namespace backend.Models;

public class PaystackPayment
{
    public int Id { get; set; }
    public string Reference { get; set; } = string.Empty;
    public string CardNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public bool Processed { get; set; }
    public DateTime ProcessedAt { get; set; }
}