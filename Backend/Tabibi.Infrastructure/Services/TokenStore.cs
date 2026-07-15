using Tabibi.Application.Interfaces;
using System.Collections.Concurrent;

namespace Tabibi.Infrastructure.Services
{
    public class InMemoryTokenStore : ITokenStore
    {
        private class TokenData
        {
            public string UserId { get; set; } = string.Empty;
            public DateTimeOffset ExpiresAt { get; set; }
        }

        private class ReplacementData
        {
            public string NewToken { get; set; } = string.Empty;
            public DateTimeOffset ExpiresAt { get; set; }
        }

        private readonly ConcurrentDictionary<string, TokenData> _tokens = new();
        private readonly ConcurrentDictionary<string, ReplacementData> _replacements = new();
        private readonly object _syncRoot = new();

        public Task<string?> GetUserIdByTokenAsync(string token)
        {
            if (_tokens.TryGetValue(token, out var data) && data.ExpiresAt > DateTimeOffset.Now)
            {
                return Task.FromResult<string?>(data.UserId);
            }
            return Task.FromResult<string?>(null);
        }

        public Task<string?> GetActiveReplacementAsync(string token)
        {
            if (_replacements.TryGetValue(token, out var data) && data.ExpiresAt > DateTimeOffset.Now)
            {
                return Task.FromResult<string?>(data.NewToken);
            }
            return Task.FromResult<string?>(null);
        }

        public Task<bool> TryRotateTokenAsync(string oldToken, string newToken, string userId, TimeSpan lifetime, TimeSpan gracePeriod)
        {
            lock (_syncRoot)
            {
                if (!_tokens.TryGetValue(oldToken, out var oldData) || oldData.ExpiresAt <= DateTimeOffset.Now)
                {
                    return Task.FromResult(false);
                }

                _tokens[newToken] = new TokenData { UserId = userId, ExpiresAt = DateTimeOffset.Now.Add(lifetime) };
                _replacements[oldToken] = new ReplacementData { NewToken = newToken, ExpiresAt = DateTimeOffset.Now.Add(gracePeriod) };
                _tokens.TryRemove(oldToken, out _);

                return Task.FromResult(true);
            }
        }

        public Task<bool> StoreTokenAsync(string token, string userId, TimeSpan lifetime)
        {
            _tokens[token] = new TokenData { UserId = userId, ExpiresAt = DateTimeOffset.Now.Add(lifetime) };
            return Task.FromResult(true);
        }

        public Task<bool> RevokeTokenAsync(string token)
        {
            return Task.FromResult(_tokens.TryRemove(token, out _));
        }

        public Task CleanupExpiredTokensAsync()
        {
            var now = DateTimeOffset.Now;
            foreach (var kvp in _tokens)
            {
                if (kvp.Value.ExpiresAt <= now)
                {
                    _tokens.TryRemove(kvp.Key, out _);
                }
            }
            foreach (var kvp in _replacements)
            {
                if (kvp.Value.ExpiresAt <= now)
                {
                    _replacements.TryRemove(kvp.Key, out _);
                }
            }
            return Task.CompletedTask;
        }
    }
}

