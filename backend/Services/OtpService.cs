using Microsoft.Extensions.Caching.Memory;
namespace backend.Services;

public class OtpService(IMemoryCache cache) {
    private static readonly Random Random = new();

    public string GenerateOtp(string email) {
        string otpCode = Random.Next(100000, 999999).ToString();
        var cacheOptions = new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(5));
        cache.Set($"OTP_{email.ToLower().Trim()}", otpCode, cacheOptions);
        return otpCode;
    }

    public bool ValidateOtp(string email, string inputOtp) {
        string key = $"OTP_{email.ToLower().Trim()}";
        if (cache.TryGetValue(key, out string? cachedOtp)) {
            if (cachedOtp == inputOtp.Trim()) {
                cache.Remove(key);
                return true;
            }
        }
        return false;
    }
}