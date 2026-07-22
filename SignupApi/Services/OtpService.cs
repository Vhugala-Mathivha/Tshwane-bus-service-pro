using Microsoft.Extensions.Caching.Memory;

namespace SignupApi.Services;

public class OtpService(IMemoryCache cache)
{
    private static readonly Random Random = new();

    // Generate a 6-digit OTP valid for 5 minutes
    public string GenerateOtp(string email)
    {
        string otpCode = Random.Next(100000, 999999).ToString();
        
        // Cache OTP key tied to email for 5 minutes
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(5));

        cache.Set($"OTP_{email.ToLower().Trim()}", otpCode, cacheOptions);

        return otpCode;
    }

    // Validate if the entered OTP matches the cached one
    public bool ValidateOtp(string email, string inputOtp)
    {
        string key = $"OTP_{email.ToLower().Trim()}";

        if (cache.TryGetValue(key, out string? cachedOtp))
        {
            if (cachedOtp == inputOtp.Trim())
            {
                cache.Remove(key); // Remove OTP after successful use
                return true;
            }
        }

        return false;
    }
}