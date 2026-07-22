namespace backend.Models;
public class Transaction {
    public int Id { get; set; } // PK (AI)
    public string CardNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Type { get; set; } = "Topup"; // Topup or Payment
    public DateTime TransactionDate { get; set; } = DateTime.Now;
    public string Description { get; set; } = string.Empty;
}