using Microsoft.EntityFrameworkCore;
using Tabibi.Data;
using Tabibi.DTOs;
using Tabibi.Models;
using Tabibi.Shared;

namespace Tabibi.Services
{
    public class ChatService(AppDbContext dbContext)
    {
        // Confirms this user is actually one of the two participants in the
        // session before letting them join the SignalR group, read history,
        // or send a message. Never trust a sessionId from the client alone.
        public async Task<ChatAccessResult> ValidateAccess(int sessionId, string userId)
        {
            var session = await dbContext.ChatSessions
                .Include(s => s.Patient).ThenInclude(p => p.User)
                .Include(s => s.Doctor).ThenInclude(d => d.User)
                .FirstOrDefaultAsync(s => s.SessionId == sessionId);

            if (session == null)
            {
                return new ChatAccessResult { Allowed = false };
            }

            // Determine if the same user is both patient and doctor in this session
            var isDual = session.Patient.UserId == userId && session.Doctor.UserId == userId;

            if (isDual)
            {
                return new ChatAccessResult { Allowed = false };
            }

            if (session.Patient.UserId == userId)
            {
                return new ChatAccessResult
                {
                    Allowed = true,
                    Role = UserRoles.Patient,
                    SenderName = session.Patient.User.FullName
                };
            }

            if (session.Doctor.UserId == userId)
            {
                return new ChatAccessResult
                {
                    Allowed = true,
                    Role = UserRoles.Doctor,
                    SenderName = session.Doctor.User.FullName
                };
            }

            return new ChatAccessResult { Allowed = false };


        }

        public async Task<List<ChatMessageDTO>> GetHistory(int sessionId)
        {
            return await dbContext.ChatMessages
                .Where(m => m.SessionId == sessionId)
                .OrderBy(m => m.SentAt)
                .Select(m => new ChatMessageDTO
                {
                    MessageId = m.MessageId,
                    SessionId = m.SessionId,
                    SenderRole = m.Role,
                    SenderName = m.Role == UserRoles.Patient
                        ? m.Session.Patient.User.FullName
                        : m.Session.Doctor.User.FullName,
                    Content = m.Content,
                    SentAt = m.SentAt
                })
                .ToListAsync();
        }

        public async Task<ChatSessionDetailsDTO?> GetSessionDetails(int sessionId)
        {
            try
            {
                return await dbContext.ChatSessions
                    .Where(s => s.SessionId == sessionId)
                    .Select(s => new ChatSessionDetailsDTO
                    {
                        SessionId = s.SessionId,
                        DoctorName = s.Doctor.User.FullName,
                        DoctorSpecialty = s.Doctor.DoctorSpecialties.FirstOrDefault() != null ? s.Doctor.DoctorSpecialties.FirstOrDefault()!.Specialty.Name : "",
                        PatientName = s.Patient.User.FullName,
                        DoctorUserId = s.Doctor.UserId,
                        PatientUserId = s.Patient.UserId
                    })
                    .FirstOrDefaultAsync();
            }
            catch 
            {
                return null;
            }
        }

        public async Task<List<ChatSessionSummaryDTO>> GetUserSessions(string userId, string role)
        {
            var query = dbContext.ChatSessions.AsQueryable();
            if (role == UserRoles.Patient)
            {
                query = query.Where(s => s.Patient.UserId == userId);
            }
            else
            {
                query = query.Where(s => s.Doctor.UserId == userId);
            }

            var sessions = await query
                .Select(s => new
                {
                    s.SessionId,
                    OtherPartyName = role == UserRoles.Patient ? s.Doctor.User.FullName : s.Patient.User.FullName,
                    OtherPartyUserId = role == UserRoles.Patient ? s.Doctor.UserId : s.Patient.UserId,
                    LastMessage = dbContext.ChatMessages
                        .Where(m => m.SessionId == s.SessionId)
                        .OrderByDescending(m => m.SentAt)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return sessions.Select(s => new ChatSessionSummaryDTO
            {
                SessionId = s.SessionId,
                OtherPartyName = s.OtherPartyName,
                OtherPartyUserId = s.OtherPartyUserId,
                LastMessage = s.LastMessage?.Content ?? "",
                LastMessageTime = s.LastMessage?.SentAt
            })
            .OrderByDescending(s => s.LastMessageTime ?? DateTime.MinValue)
            .ToList();
        }

        public async Task<ChatMessage> SaveMessage(int sessionId, string role, string content)
        {
            var message = new ChatMessage
            {
                SessionId = sessionId,
                Role = role,
                Content = content,
                SentAt = DateTime.UtcNow
            };

            dbContext.ChatMessages.Add(message);
            await dbContext.SaveChangesAsync();

            return message;
        }

        public async Task<ChatSession> StartOrGetSessionAsync(string patientUserId, int doctorId)
        {
            var patient = await dbContext.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == patientUserId);
            if (patient == null)
            {
                throw new Exception("Patient not found.");
            }

            // Verify doctor exists
            var doctorExists = await dbContext.DoctorProfiles.AnyAsync(d => d.DoctorId == doctorId);
            if (!doctorExists)
            {
                throw new Exception("Doctor not found.");
            }

            var existingSession = await dbContext.ChatSessions
                .FirstOrDefaultAsync(s => s.PatientId == patient.PatientId && s.DoctorId == doctorId);

            if (existingSession != null)
            {
                return existingSession;
            }

            var newSession = new ChatSession
            {
                PatientId = patient.PatientId,
                DoctorId = doctorId,
                ConsultationType = ConsultationType.Chat,
                Status = SessionStatus.Active,
                StartedAt = DateTime.UtcNow
            };

            dbContext.ChatSessions.Add(newSession);
            await dbContext.SaveChangesAsync();

            return newSession;
        }
    }
}
