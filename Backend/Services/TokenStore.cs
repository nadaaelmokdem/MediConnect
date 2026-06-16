using StackExchange.Redis;

namespace Tabibi.Services
{
    public class RedisTokenStore(IConnectionMultiplexer redis) : ITokenStore
    {
        private readonly IDatabase _cache = redis.GetDatabase();

        public async Task<string?> GetUserIdByTokenAsync(string token) =>
            await _cache.StringGetAsync($"refresh-token:{token}");

        public async Task<string?> GetActiveReplacementAsync(string token) =>
            await _cache.StringGetAsync($"rotated-to:{token}");

        public async Task<bool> TryRotateTokenAsync(string oldToken, string newToken, string userId, TimeSpan lifetime, TimeSpan gracePeriod)
        {
            var transaction = _cache.CreateTransaction();
            transaction.AddCondition(Condition.KeyExists($"refresh-token:{oldToken}"));

            _ = transaction.StringSetAsync($"refresh-token:{newToken}", userId, lifetime);
            _ = transaction.StringSetAsync($"rotated-to:{oldToken}", newToken, gracePeriod);
            _ = transaction.KeyDeleteAsync($"refresh-token:{oldToken}");

            return await transaction.ExecuteAsync();
        }
        public async Task<bool> TryAcquireLockAsync(string lockKey, string lockValue, TimeSpan timeout)
        {
            return await _cache.StringSetAsync(lockKey, lockValue, timeout, When.NotExists);
        }

        public async Task<bool> ReleaseLockAsync(string lockKey, string lockValue)
        {
            string luaScript = @"
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end";

            var result = await _cache.ScriptEvaluateAsync(luaScript, new RedisKey[] { lockKey }, new RedisValue[] { lockValue });
            return (int)result == 1;
        }
    }
}
