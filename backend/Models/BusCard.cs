namespace backend.Models;
public class BusCard {
    public string CardNumber { get; set; } = string.Empty; // PK
    public string UserId { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}