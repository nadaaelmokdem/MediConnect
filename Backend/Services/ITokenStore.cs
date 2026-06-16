namespace Tabibi.Services
{
    public interface ITokenStore
    {
        Task<string?> GetUserIdByTokenAsync(string token);
        Task<string?> GetActiveReplacementAsync(string token);
        Task<bool> TryRotateTokenAsync(string oldToken, string newToken, string userId, TimeSpan lifetime, TimeSpan gracePeriod);
        Task<bool> TryAcquireLockAsync(string lockKey, string lockValue, TimeSpan timeout);
        Task<bool> ReleaseLockAsync(string lockKey, string lockValue);
    }
}
