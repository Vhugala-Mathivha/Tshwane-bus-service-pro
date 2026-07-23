namespace backend.DTOs;

public class ForgotPasswordRequest {
    public string IdNumber { get; set; } = string.Empty;
}

public class VerifyForgotOtpRequest {
    public string Email { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
}

public class ResetPasswordRequest {
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}