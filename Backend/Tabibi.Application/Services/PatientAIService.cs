using Tabibi.Application.Interfaces;
using Tabibi.Application.DTOs;
using Tabibi.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using Tabibi.Application.Shared;
using System.Collections.Generic;

namespace Tabibi.Application.Services
{
    public class PatientAIService(IUnitOfWork unitOfWork, IAIDoctor aiDoctor, IChatService chatService, IPaymentService paymentService) : Tabibi.Application.Interfaces.IPatientAIService
    {
        public async Task<ServiceResult<QuotaResponseDTO>> GetQuotaAsync(string userId)
        {
            var patient = await unitOfWork.PatientProfiles.Query().Include(p => p.Quota).FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return ServiceResult<QuotaResponseDTO>.Failure("Patient not found");

            if (patient.Quota == null)
            {
                patient.Quota = new PatientQuota { PatientId = patient.PatientId };
                await unitOfWork.PatientQuotas.AddAsync(patient.Quota);
            }

            // Daily reset logic
            if (DateTime.UtcNow - patient.Quota.LastAiMessageReset > TimeSpan.FromDays(1))
            {
                patient.Quota.AvailableAiMessages = 15;
                patient.Quota.LastAiMessageReset = DateTime.UtcNow;
            }

            // Monthly GP reset logic
            if (DateTime.UtcNow.Month != patient.Quota.LastFreeGpMessageReset.Month || DateTime.UtcNow.Year != patient.Quota.LastFreeGpMessageReset.Year)
            {
                patient.Quota.AvailableFreeGpMessages = 2;
                patient.Quota.LastFreeGpMessageReset = DateTime.UtcNow;
            }

            await unitOfWork.CompleteAsync();

            return ServiceResult<QuotaResponseDTO>.Success(new QuotaResponseDTO 
            { 
                FreeAiMessages = patient.Quota.AvailableAiMessages, 
                PremiumAiMessages = patient.Quota.AvailablePremiumAiMessages, 
                FreeGpMessages = patient.Quota.AvailableFreeGpMessages 
            });
        }

        public async Task<ServiceResult<InitiateRechargeResponseDTO>> InitiateRechargeAsync(string userId, decimal amount)
        {
            if (amount < 10 || amount % 10 != 0)
            {
                return ServiceResult<InitiateRechargeResponseDTO>.Failure("Amount must be a multiple of 10 EGP (minimum 10 EGP).");
            }

            var patient = await unitOfWork.PatientProfiles.Query().Include(p => p.User).Include(p => p.Quota).FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return ServiceResult<InitiateRechargeResponseDTO>.Failure("Patient not found");

            int messagesGranted = (int)(amount / 10) * 20;

            var recharge = new AiRecharge
            {
                PatientId = patient.PatientId,
                Amount = amount,
                MessagesGranted = messagesGranted,
                Status = PaymentStatus.Pending,
                Gateway = PaymentGateway.Geidea
            };

            await unitOfWork.AiRecharges.AddAsync(recharge);
            await unitOfWork.CompleteAsync();

            try
            {
                var paymentUrl = await paymentService.GenerateRechargePaymentLinkAsync(
                    recharge,
                    patient.User.Email ?? "",
                    patient.User.PhoneNumber ?? "",
                    patient.User.FullName);

                await unitOfWork.CompleteAsync();

                return ServiceResult<InitiateRechargeResponseDTO>.Success(new InitiateRechargeResponseDTO
                {
                    PaymentUrl = paymentUrl,
                    MessagesGranted = messagesGranted,
                    Amount = amount
                });
            }
            catch
            {
                unitOfWork.AiRecharges.Remove(recharge);
                await unitOfWork.CompleteAsync();
                return ServiceResult<InitiateRechargeResponseDTO>.Failure("Failed to generate payment link. Please try again.");
            }
        }

        public async Task<ServiceResult<string>> AskAIAsync(string userId, SendAIMessageDTO request)
        {
            long patientId;
            bool usedFreeMessage;

            await using (var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.RepeatableRead))
            {
                try
                {
                    var patient = await unitOfWork.PatientProfiles.Query().Include(p => p.Quota).FirstOrDefaultAsync(p => p.UserId == userId);
                    if (patient == null)
                    {
                        await transaction.RollbackAsync();
                        return ServiceResult<string>.Failure("Patient not found");
                    }

                    if (patient.Quota == null)
                    {
                        patient.Quota = new PatientQuota { PatientId = patient.PatientId };
                        await unitOfWork.PatientQuotas.AddAsync(patient.Quota);
                    }

                    if (DateTime.UtcNow - patient.Quota.LastAiMessageReset > TimeSpan.FromDays(1))
                    {
                        patient.Quota.AvailableAiMessages = 15;
                        patient.Quota.LastAiMessageReset = DateTime.UtcNow;
                    }

                    if (patient.Quota.AvailableAiMessages > 0)
                    {
                        patient.Quota.AvailableAiMessages--;
                        usedFreeMessage = true;
                    }
                    else if (patient.Quota.AvailablePremiumAiMessages > 0)
                    {
                        patient.Quota.AvailablePremiumAiMessages--;
                        usedFreeMessage = false;
                    }
                    else
                    {
                        await transaction.RollbackAsync();
                        return ServiceResult<string>.Failure("AI message quota exceeded. Please recharge.");
                    }

                    patientId = patient.PatientId;
                    await unitOfWork.CompleteAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }

            // From here on, the patient's quota has already been spent. Any failure below
            // must refund it — otherwise the patient is charged for a reply they never got.
            try
            {
                var session = await chatService.StartOrGetAISessionAsync(userId, request.SessionId);

                // save user's message
                await chatService.SaveMessage(session.SessionId, UserRoles.Patient, request.RequestText);

                var aiResponseString = await aiDoctor.Ask(request.RequestText, request.ContextText);

                // parse JSON and inject sessionId
                var responseJson = JsonDocument.Parse(aiResponseString);
                var responseObj = JsonSerializer.Deserialize<Dictionary<string, object>>(responseJson.RootElement.GetRawText());
                if (responseObj != null)
                {
                    responseObj["sessionId"] = session.SessionId;
                    aiResponseString = JsonSerializer.Serialize(responseObj);
                }

                string userFacingReply = "";
                using (var doc = JsonDocument.Parse(aiResponseString))
                {
                    if (doc.RootElement.TryGetProperty("user_facing_reply", out var replyElement))
                    {
                        userFacingReply = replyElement.GetString() ?? "";
                    }

                    if (doc.RootElement.TryGetProperty("clinical_assessment", out var assessmentElement))
                    {
                        session.SessionSummary = assessmentElement.GetString();
                        await unitOfWork.CompleteAsync();
                    }
                }

                if (string.IsNullOrWhiteSpace(userFacingReply))
                {
                    await RefundAiMessageAsync(patientId, usedFreeMessage);
                    return ServiceResult<string>.Failure("The AI assistant didn't return a usable reply. Your message credit has been refunded — please try again.");
                }

                await chatService.SaveMessage(session.SessionId, "AI Doctor", userFacingReply);

                return ServiceResult<string>.Success(aiResponseString);
            }
            catch
            {
                await RefundAiMessageAsync(patientId, usedFreeMessage);
                throw;
            }
        }

        private async Task RefundAiMessageAsync(long patientId, bool wasFreeMessage)
        {
            var quota = await unitOfWork.PatientQuotas.Query().FirstOrDefaultAsync(q => q.PatientId == patientId);
            if (quota == null) return;

            if (wasFreeMessage) quota.AvailableAiMessages++;
            else quota.AvailablePremiumAiMessages++;

            await unitOfWork.CompleteAsync();
        }

        public async Task<ServiceResult<ChatHistoryResponseDTO>> GetHistoryAsync(string userId, long sessionId)
        {
            var patient = await unitOfWork.PatientProfiles.Query().FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return ServiceResult<ChatHistoryResponseDTO>.Failure("Patient not found");

            var session = await unitOfWork.ChatSessions.Query()
                .FirstOrDefaultAsync(s => s.PatientId == patient.PatientId && s.DoctorId == null && s.SessionId == sessionId);

            if (session == null) return ServiceResult<ChatHistoryResponseDTO>.Success(new ChatHistoryResponseDTO 
            { 
                Messages = new List<ChatMessageDTO>(), 
                ClinicalAssessment = "" 
            });

            var history = await chatService.GetHistory(session.SessionId);
            return ServiceResult<ChatHistoryResponseDTO>.Success(new ChatHistoryResponseDTO 
            { 
                Messages = history, 
                ClinicalAssessment = session.SessionSummary ?? "" 
            });
        }
    }
}
