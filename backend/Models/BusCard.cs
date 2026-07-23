namespace backend.Models;
public class BusCard {
    public string CardNumber { get; set; } = string.Empty; // PK
    public string UserId { get; set; } = string.Empty;
    public decimal Balance { get; set; }

     // Link back to the User
    public User? User { get; set; }
    // Link to the list of transactions
    public List<Transaction> Transactions { get; set; } = new();
}