using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Tabibi.Application.Interfaces;
using Tabibi.Core.Models;
using Tabibi.Infrastructure.Data;

namespace Tabibi.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IRepository<PatientProfile> PatientProfiles { get; private set; }
    public IRepository<DoctorProfile> DoctorProfiles { get; private set; }
    public IRepository<Appointment> Appointments { get; private set; }
    public IRepository<ChatSession> ChatSessions { get; private set; }
    public IRepository<ChatMessage> ChatMessages { get; private set; }
    public IRepository<DoctorReview> Reviews { get; private set; }
    public IRepository<Specialty> Specialties { get; private set; }
    public IRepository<DoctorAvailability> DoctorAvailabilities { get; private set; }
    public IRepository<DoctorSpecialty> DoctorSpecialties { get; private set; }
    public IRepository<DoctorOldSpecialty> DoctorOldSpecialties { get; private set; }
    public IRepository<Payment> Payments { get; private set; }
    public IRepository<DoctorProfileChangeLog> DoctorProfileChangeLogs { get; private set; }
    public IRepository<PatientQuota> PatientQuotas { get; private set; }
    public IRepository<AiRecharge> AiRecharges { get; private set; }
    public IRepository<AppUser> Users { get; private set; }
    public IRepository<Microsoft.AspNetCore.Identity.IdentityRole> Roles { get; private set; }
    public IRepository<Microsoft.AspNetCore.Identity.IdentityUserRole<string>> UserRoles { get; private set; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        PatientProfiles = new Repository<PatientProfile>(_context);
        DoctorProfiles = new Repository<DoctorProfile>(_context);
        Appointments = new Repository<Appointment>(_context);
        ChatSessions = new Repository<ChatSession>(_context);
        ChatMessages = new Repository<ChatMessage>(_context);
        Reviews = new Repository<DoctorReview>(_context);
        Specialties = new Repository<Specialty>(_context);
        DoctorAvailabilities = new Repository<DoctorAvailability>(_context);
        DoctorSpecialties = new Repository<DoctorSpecialty>(_context);
        DoctorOldSpecialties = new Repository<DoctorOldSpecialty>(_context);
        Payments = new Repository<Payment>(_context);
        DoctorProfileChangeLogs = new Repository<DoctorProfileChangeLog>(_context);
        PatientQuotas = new Repository<PatientQuota>(_context);
        AiRecharges = new Repository<AiRecharge>(_context);
        Users = new Repository<AppUser>(_context);
        Roles = new Repository<Microsoft.AspNetCore.Identity.IdentityRole>(_context);
        UserRoles = new Repository<Microsoft.AspNetCore.Identity.IdentityUserRole<string>>(_context);
    }

    public Task<IDbContextTransaction> BeginTransactionAsync(System.Data.IsolationLevel? isolationLevel = null)
    {
        if (isolationLevel.HasValue) return _context.Database.BeginTransactionAsync(isolationLevel.Value); return _context.Database.BeginTransactionAsync();
    }

    public async Task<int> CompleteAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}








