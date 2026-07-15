namespace Tabibi.Application.Interfaces;

public interface IPresenceTracker
{
    void UserConnected(string userId, string connectionId);
    void UserDisconnected(string userId, string connectionId);
    bool IsUserOnline(string userId);
}
