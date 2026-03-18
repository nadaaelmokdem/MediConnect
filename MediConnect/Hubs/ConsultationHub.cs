using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MediConnect.Hubs
{
    [Authorize]
    public class ConsultationHub : Hub
    {
        // Patient or Doctor joins a consultation room by AppointmentId
        public async Task JoinRoom(string appointmentId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, appointmentId);
            await Clients.Group(appointmentId)
                         .SendAsync("UserJoined", Context.User?.Identity?.Name);
        }

        // Send a message to everyone in the room
        public async Task SendMessage(string appointmentId, string message)
        {
            var sender = Context.User?.Identity?.Name ?? "Unknown";
            await Clients.Group(appointmentId)
                         .SendAsync("ReceiveMessage", sender, message, DateTime.UtcNow.ToString("HH:mm"));
        }

        // Doctor signals they are typing
        public async Task Typing(string appointmentId)
        {
            await Clients.OthersInGroup(appointmentId)
                         .SendAsync("UserTyping");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}