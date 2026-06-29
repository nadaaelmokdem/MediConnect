using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Tabibi.Models;

namespace Tabibi.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options)
    {
        // Core Models
        public DbSet<PatientProfile> PatientProfiles { get; set; }
        public DbSet<DoctorProfile> DoctorProfiles { get; set; }
        public DbSet<Specialty> Specialties { get; set; }

        // Doctor Relations
        public DbSet<DoctorSpecialty> DoctorSpecialties { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<DoctorReview> DoctorReviews { get; set; }

        // Chat & AI
        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<SymptomAnalysis> SymptomAnalyses { get; set; }

        // Appointments & Healthcare
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionItem> PrescriptionItems { get; set; }

        // Payments
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==================== AppUser Configurations ====================
            
            // AppUser to PatientProfile (1:1 optional)
            modelBuilder.Entity<AppUser>()
                .HasOne(u => u.PatientProfile)
                .WithOne(p => p.User)
                .HasForeignKey<PatientProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== PatientProfile Configurations ====================
            
            // PatientProfile to ChatSession (1:many)
            modelBuilder.Entity<PatientProfile>()
                .HasMany(p => p.ChatSessions)
                .WithOne(cs => cs.Patient)
                .HasForeignKey(cs => cs.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // DoctorProfile to ChatSession (Prevent cascade path)
            modelBuilder.Entity<ChatSession>()
                .HasOne(cs => cs.Doctor)
                .WithMany()
                .HasForeignKey(cs => cs.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // PatientProfile to Appointment (1:many)
            modelBuilder.Entity<PatientProfile>()
                .HasMany(p => p.Appointments)
                .WithOne(a => a.Patient)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // ==================== DoctorProfile Configurations ====================
            
            // DoctorProfile to DoctorSpecialty (1:many)
            modelBuilder.Entity<DoctorProfile>()
                .HasMany(d => d.DoctorSpecialties)
                .WithOne(ds => ds.Doctor)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            // DoctorProfile to DoctorAvailability (1:many)
            modelBuilder.Entity<DoctorProfile>()
                .HasMany(d => d.Availabilities)
                .WithOne(da => da.Doctor)
                .HasForeignKey(da => da.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            // DoctorProfile to Appointment (1:many)
            modelBuilder.Entity<DoctorProfile>()
                .HasMany(d => d.Appointments)
                .WithOne(a => a.Doctor)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // ==================== Specialty Configurations ====================
            
            // Specialty to DoctorSpecialty (1:many)
            modelBuilder.Entity<Specialty>()
                .HasMany(s => s.DoctorSpecialties)
                .WithOne(ds => ds.Specialty)
                .HasForeignKey(ds => ds.SpecialtyId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== DoctorSpecialty Configurations ====================
            
            // DoctorSpecialty - composite key
            modelBuilder.Entity<DoctorSpecialty>()
                .HasKey(ds => ds.Id);

            // ==================== ChatSession Configurations ====================
            
            // ChatSession to ChatMessage (1:many)
            modelBuilder.Entity<ChatSession>()
                .HasMany(cs => cs.Messages)
                .WithOne(cm => cm.Session)
                .HasForeignKey(cm => cm.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            // ChatSession to SymptomAnalysis (1:1 optional)
            modelBuilder.Entity<ChatSession>()
                .HasOne(cs => cs.SymptomAnalysis)
                .WithOne(sa => sa.Session)
                .HasForeignKey<SymptomAnalysis>(sa => sa.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== SymptomAnalysis Configurations ====================
            
            // SymptomAnalysis to DoctorProfile (RoutedDoctor - optional)
            modelBuilder.Entity<SymptomAnalysis>()
                .HasOne(sa => sa.RoutedDoctor)
                .WithMany()
                .HasForeignKey(sa => sa.RoutedDoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // ==================== Prescription Configurations ====================
            
            // Prescription to Appointment (1:1 optional)
            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Appointment)
                .WithOne(a => a.Prescription)
                .HasForeignKey<Prescription>(p => p.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== Payment Configurations ====================
            
            // Payment to Appointment (1:1 optional)
            modelBuilder.Entity<Payment>()
                .HasOne(pm => pm.Appointment)
                .WithOne(a => a.Payment)
                .HasForeignKey<Payment>(pm => pm.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== DoctorReview Configurations ====================
            
            // DoctorReview to Appointment (1:1 optional)
            modelBuilder.Entity<DoctorReview>()
                .HasOne(dr => dr.Appointment)
                .WithOne(a => a.Review)
                .HasForeignKey<DoctorReview>(dr => dr.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== PrescriptionItem Configurations ====================
            
            // Prescription to PrescriptionItem (1:many)
            modelBuilder.Entity<Prescription>()
                .HasMany(p => p.Items)
                .WithOne(pi => pi.Prescription)
                .HasForeignKey(pi => pi.PrescriptionId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== Indexes ====================
            
            // Chat indexes
            modelBuilder.Entity<ChatSession>()
                .HasIndex(cs => cs.PatientId);

            modelBuilder.Entity<ChatMessage>()
                .HasIndex(cm => cm.SessionId);

            // Appointment indexes
            modelBuilder.Entity<Appointment>()
                .HasIndex(a => new { a.PatientId, a.DoctorId });

            modelBuilder.Entity<Appointment>()
                .HasIndex(a => a.ScheduledAt);

            // Doctor availability indexes
            modelBuilder.Entity<DoctorAvailability>()
                .HasIndex(da => da.DoctorId);

            // Review indexes
            modelBuilder.Entity<DoctorReview>()
                .HasIndex(dr => dr.AppointmentId);

            // Specialty indexes
            modelBuilder.Entity<DoctorSpecialty>()
                .HasIndex(ds => ds.DoctorId);

            modelBuilder.Entity<DoctorSpecialty>()
                .HasIndex(ds => ds.SpecialtyId);

            // Payment indexes
            modelBuilder.Entity<Payment>()
                .HasIndex(pm => pm.AppointmentId);

            // Prescription indexes
            modelBuilder.Entity<Prescription>()
                .HasIndex(p => p.AppointmentId);
        }
    }
}