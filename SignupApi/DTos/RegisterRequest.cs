namespace SignupApi.DTOs;

public class RegisterRequest
{
    public string CardNumber { get; set; } = "";
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";

    public string Password { get; set; } = "";
    public string ConfirmPassword { get; set; } = "";
}