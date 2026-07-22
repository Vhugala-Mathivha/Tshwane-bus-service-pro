namespace backend.Models;

public enum TransactionType
    {
        Load,
        Trip,
    }

public class Transaction {
    public int Id { get; set; } // PK (AI)
    public string CardNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public DateTime TransactionDate { get; set; } = DateTime.Now;
    public string Description { get; set; } = string.Empty;

    public BusCard? BusCard { get; set; }
}