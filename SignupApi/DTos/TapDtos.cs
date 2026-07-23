namespace SignupApi.DTOs;

public class ProcessPaymentRequest
{
    public string CardNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; } = 15.00m; // Default flat fare R15.00
}

public class CardDetailsResponse
{
    public string CardNumber { get; set; } = string.Empty;
    public string CardHolderName { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public decimal StandardFare { get; set; } = 15.00m;
}