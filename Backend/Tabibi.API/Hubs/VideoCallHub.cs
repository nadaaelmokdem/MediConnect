using Tabibi.Core.Models;
using Tabibi.Application.DTOs;
using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

using Tabibi.Application.Interfaces;

namespace Tabibi.API.Hubs
{
    [Authorize]
    public class VideoCallHub(IChatService chatService) : Hub
    {
        // SessionId -> (UserId -> ConnectionId)
        private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, string>> _roomUsers = new();

        // Tracks whether both parties have successfully joined the call room
        public static readonly ConcurrentDictionary<long, bool> CallStarted = new();

        public async Task JoinCall(long sessionId)
        {
            var userId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userId)) return;

            var access = await chatService.ValidateVideoCallAccess(sessionId, userId);
            if (!access.Allowed)
            {
                await Clients.Caller.SendAsync("Unauthorized", access.ErrorMessage ?? "You do not have access to this video call session.");
                return;
            }

            // SECURITY: Require payment before joining video call room
            if (!await chatService.IsVideoCallSessionPaidAsync(sessionId))
            {
                await Clients.Caller.SendAsync("Unauthorized", "Payment required to join this video call session.");
                return;
            }

            var sessionIdStr = sessionId.ToString();
            var room = _roomUsers.GetOrAdd(sessionIdStr, _ => new ConcurrentDictionary<string, string>());
            room.AddOrUpdate(userId, Context.ConnectionId, (_, _) => Context.ConnectionId);

            await Groups.AddToGroupAsync(Context.ConnectionId, sessionIdStr);

            // If both doctor and patient are in the room, mark the call as active/started
            if (room.Count >= 2)
            {
                CallStarted[sessionId] = true;
            }

            // Notify others in the room that this user joined
            await Clients.GroupExcept(sessionIdStr, Context.ConnectionId).SendAsync("UserJoined", userId);
        }

        public async Task LeaveCall(long sessionId)
        {
            var userId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userId)) return;

            var sessionIdStr = sessionId.ToString();
            if (_roomUsers.TryGetValue(sessionIdStr, out var room))
            {
                room.TryRemove(userId, out _);
                if (room.IsEmpty)
                {
                    _roomUsers.TryRemove(sessionIdStr, out _);
                }
            }

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionIdStr);
            await Clients.Group(sessionIdStr).SendAsync("UserLeft", userId);

            // If the call had started and one party ends/leaves it, complete the session
            if (CallStarted.TryRemove(sessionId, out _))
            {
                await chatService.CompleteVideoCallSessionAsync(sessionId);
            }
        }

        public async Task NotifyUserReconnected(long sessionId)
        {
            var userId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userId)) return;

            await Clients.GroupExcept(sessionId.ToString(), Context.ConnectionId).SendAsync("PeerReconnected", userId);
        }

        public async Task SendMessage(long sessionId, string message)
        {
            var userId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userId)) return;

            var access = await chatService.ValidateVideoCallAccess(sessionId, userId);
            if (!access.Allowed) return;

            await Clients.Group(sessionId.ToString()).SendAsync("ReceiveMessage", userId, message);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            var connectionId = Context.ConnectionId;

            if (!string.IsNullOrEmpty(userId))
            {
                foreach (var (sessionIdStr, room) in _roomUsers)
                {
                    if (room.TryGetValue(userId, out var storedConnectionId) && storedConnectionId == connectionId)
                    {
                        room.TryRemove(userId, out _);
                        await Clients.Group(sessionIdStr).SendAsync("UserLeft", userId);

                        if (long.TryParse(sessionIdStr, out var sessionId))
                        {
                            // If the call had started and someone disconnected, complete the session
                            if (CallStarted.TryRemove(sessionId, out _))
                            {
                                await chatService.CompleteVideoCallSessionAsync(sessionId);
                            }
                        }

                        if (room.IsEmpty)
                        {
                            _roomUsers.TryRemove(sessionIdStr, out _);
                        }
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}


