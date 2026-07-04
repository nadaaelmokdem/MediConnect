using System.Collections.Concurrent;

namespace Tabibi.Services
{
    public class PresenceTracker
    {
        private readonly ConcurrentDictionary<string, HashSet<string>> _onlineUsers = new();

        public void UserConnected(string userId, string connectionId)
        {
            _onlineUsers.AddOrUpdate(userId,
                new HashSet<string> { connectionId },
                (key, existing) =>
                {
                    lock (existing)
                    {
                        existing.Add(connectionId);
                    }
                    return existing;
                });
        }

        public void UserDisconnected(string userId, string connectionId)
        {
            if (_onlineUsers.TryGetValue(userId, out var connections))
            {
                lock (connections)
                {
                    connections.Remove(connectionId);
                    if (connections.Count == 0)
                    {
                        _onlineUsers.TryRemove(userId, out _);
                    }
                }
            }
        }

        public bool IsUserOnline(string userId)
        {
            return _onlineUsers.ContainsKey(userId);
        }
    }
}
