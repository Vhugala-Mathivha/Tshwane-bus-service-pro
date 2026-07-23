namespace backend.DTOs;

public class LoginRequestDto {
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto {
    public string Token { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;
    public string CardNumber { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}

// --- ADD THESE NEW REGISTRATION DTOs BELOW ---
public class RegisterRequest {
    public string CardNumber { get; set; } = "";
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string ConfirmPassword { get; set; } = "";
}

public class VerifyOtpRequest {
    public string Email { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
}

public class TopUpRequest {
    public string Email { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string CardNumber { get; set; } = string.Empty;
}
