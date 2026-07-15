using Tabibi.Core.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace Tabibi.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<PatientProfile> PatientProfiles { get; }
    IRepository<DoctorProfile> DoctorProfiles { get; }
    IRepository<Appointment> Appointments { get; }
    IRepository<ChatSession> ChatSessions { get; }
    IRepository<VideoCallSession> VideoCallSessions { get; }
    IRepository<ChatMessage> ChatMessages { get; }
    IRepository<DoctorReview> Reviews { get; }
    IRepository<Specialty> Specialties { get; }
    IRepository<DoctorAvailability> DoctorAvailabilities { get; }
    IRepository<DoctorSpecialty> DoctorSpecialties { get; }
    IRepository<DoctorOldSpecialty> DoctorOldSpecialties { get; }
    IRepository<Payment> Payments { get; }
    IRepository<DoctorProfileChangeLog> DoctorProfileChangeLogs { get; }
    IRepository<PatientQuota> PatientQuotas { get; }    
    IRepository<AiRecharge> AiRecharges { get; }
    IRepository<AppUser> Users { get; }
    IRepository<Microsoft.AspNetCore.Identity.IdentityRole> Roles { get; }
    IRepository<Microsoft.AspNetCore.Identity.IdentityUserRole<string>> UserRoles { get; }
    
    // Instead of using DbContext.Database.BeginTransactionAsync
    Task<IDbContextTransaction> BeginTransactionAsync(System.Data.IsolationLevel? isolationLevel = null);
    
    Task<int> CompleteAsync(CancellationToken cancellationToken = default);
}






