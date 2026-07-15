using Tabibi.Application.DTOs;
using Tabibi.Application.Shared;
using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface IChatService
{
    Task<ChatAccessResult> ValidateAccess(int sessionId, string userId);
    Task<List<ChatMessageDTO>> GetHistory(int sessionId);
    Task<ChatSessionDetailsDTO?> GetSessionDetails(int sessionId);
    Task<List<ChatSessionSummaryDTO>> GetUserSessions(string userId, string role);
    Task<ChatMessage> SaveMessage(int sessionId, string role, string content, bool isSystemMessage = false);
    Task<ChatSession> StartOrGetSessionAsync(string patientUserId, int doctorId, bool isCompanyPaid = false);
    Task<ChatSession> StartOrGetAISessionAsync(string patientUserId, int? sessionId = null);
    Task<ChatSession> FollowUpSessionAsync(int sessionId, string patientUserId);
}
