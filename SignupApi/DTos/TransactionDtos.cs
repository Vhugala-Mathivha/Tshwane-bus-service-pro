namespace SignupApi.DTOs;

public record TransactionResponseDto(
    int Id,
    string CardNumber,
    decimal Amount,
    string Type,
    DateTime TransactionDate,
    string? Description
);

public record CreateTransactionRequestDto(
    string CardNumber,
    decimal Amount,
    string Type, // "Load" or "Trip"
    string? Description
);