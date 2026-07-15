using Tabibi.Core.Models;
using Microsoft.AspNetCore.SignalR;
using Tabibi.Application.Extensions;

namespace Tabibi.API.Hubs;

public class SubClaimUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.GetId();
    }
}


