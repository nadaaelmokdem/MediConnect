using Microsoft.EntityFrameworkCore;
using Tabibi.Data;
using Tabibi.Shared;
using System.Text.Json;
using Tabibi.Models;
using Tabibi.DTOs;
using Tabibi.Extensions;

namespace Tabibi.Services
{
    public class DoctorService(AppDbContext dbContext)
    {


        public async Task<DoctorProfileDTO?> GetProfile(string userId)
        {
            var doctor = await dbContext.DoctorProfiles
                .Include(d => d.User)
                .Include(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null) return null;

            return doctor.ToDTO();
        }

        public async Task<ServiceResult> UpdateProfileField(string userId, string fieldName, string value)
        {
            var doctor = await dbContext.DoctorProfiles
                .Include(d => d.DoctorSpecialties)
                .FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctor == null)
            {
                return ServiceResult.Failure("Doctor profile not found!");
            }

            try
            {
                switch (fieldName.ToLower())
                {
                    case "licensenumber":
                        if (doctor.IsVerified) return ServiceResult.Failure("Cannot edit sensitive data while verified.");
                        if (doctor.LicenseNumber != value)
                        {
                            doctor.LicenseNumber = value;
                        }
                        break;
                    case "nationalidnumber":
                        if (doctor.IsVerified) return ServiceResult.Failure("Cannot edit sensitive data while verified.");
                        if (doctor.NationalIdNumber != value)
                        {
                            doctor.NationalIdNumber = value;
                        }
                        break;
                    case "cliniclocation":
                        doctor.ClinicLocation = value;
                        break;
                    case "clinicphonenumber":
                        doctor.ClinicPhoneNumber = value;
                        break;
                    case "bio":
                        doctor.Bio = value;
                        break;
                    case "yearsofexperience":
                        if (string.IsNullOrWhiteSpace(value))
                        {
                            doctor.YearsOfExperience = null;
                        }
                        else if (int.TryParse(value, out int years))
                        {
                            doctor.YearsOfExperience = years;
                        }
                        break;
                    case "licenseexpirydate":
                        if (doctor.IsVerified) return ServiceResult.Failure("Cannot edit sensitive data while verified.");
                        if (string.IsNullOrWhiteSpace(value))
                        {
                            doctor.LicenseExpiryDate = null;
                        }
                        else if (DateTime.TryParse(value, out DateTime expiry))
                        {
                            doctor.LicenseExpiryDate = expiry;
                        }
                        break;
                    case "specialties":
                        if (doctor.IsVerified) return ServiceResult.Failure("Cannot edit sensitive data while verified.");
                        
                        var names = value.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList();
                        
                        if (names.Distinct(StringComparer.OrdinalIgnoreCase).Count() != names.Count)
                        {
                            return ServiceResult.Failure("Duplicate specialties are not allowed.");
                        }
                        
                        if (names.Count > 3)
                        {
                            return ServiceResult.Failure("A doctor can have a maximum of 3 specialties.");
                        }

                        var allSpecialties = await dbContext.Specialties.Where(s => names.Contains(s.Name)).ToListAsync();
                        var newSpecialtyIds = allSpecialties.Select(s => s.SpecialtyId).ToList();

                        var currentSpecialties = doctor.DoctorSpecialties.ToList();
                        var currentSpecialtyIds = currentSpecialties.Select(ds => ds.SpecialtyId).ToList();

                        var toRemove = currentSpecialties.Where(ds => !newSpecialtyIds.Contains(ds.SpecialtyId)).ToList();
                        dbContext.DoctorSpecialties.RemoveRange(toRemove);

                        var toAddIds = newSpecialtyIds.Where(id => !currentSpecialtyIds.Contains(id)).ToList();
                        foreach (var id in toAddIds)
                        {
                            doctor.DoctorSpecialties.Add(new DoctorSpecialty { DoctorId = doctor.DoctorId, SpecialtyId = id });
                        }
                        break;
                    case "licenseproofurl":
                        if (doctor.IsVerified) return ServiceResult.Failure("Cannot edit sensitive data while verified.");
                        doctor.LicenseProofUrl = value;
                        break;
                    case "idproofurl":
                        if (doctor.IsVerified) return ServiceResult.Failure("Cannot edit sensitive data while verified.");
                        doctor.IdProofUrl = value;
                        break;
                    case "degreeproofurl":
                        if (doctor.IsVerified) return ServiceResult.Failure("Cannot edit sensitive data while verified.");
                        doctor.DegreeProofUrl = value;
                        break;
                    case "profilepictureurl":
                        doctor.ProfilePictureUrl = value;
                        break;
                    default:
                        return ServiceResult.Failure("Field doesn't exist or cannot be updated via this endpoint!");
                }

                await dbContext.SaveChangesAsync();
                return ServiceResult.Success();
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure(ex.Message);
            }
        }

        public async Task<ServiceResult<DoctorProfileDTO>> BulkUpdateProfile(string userId, DoctorProfileBulkUpdateDTO profileData)
        {
            var doctor = await dbContext.DoctorProfiles
                .Include(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null)
            {
                return ServiceResult<DoctorProfileDTO>.Failure("Doctor profile not found!");
            }

            if ((profileData.IsClinicEnabled && profileData.ClinicPrice <= 0) ||
                (profileData.IsChatEnabled && profileData.ChatPrice <= 0) ||
                (profileData.IsVideoEnabled && profileData.VideoPrice <= 0) ||
                (profileData.IsCallEnabled && profileData.CallPrice <= 0))
            {
                return ServiceResult<DoctorProfileDTO>.Failure("Prices must be greater than 0.");
            }

            try
            {
                doctor.ClinicLocation = profileData.ClinicLocation;
                doctor.ClinicPhoneNumber = profileData.ClinicPhoneNumber;
                doctor.ProfilePictureUrl = profileData.ProfilePictureUrl;
                doctor.Bio = profileData.Bio;
                doctor.YearsOfExperience = profileData.YearsOfExperience;

                if (!doctor.IsVerified)
                {
                    doctor.LicenseNumber = profileData.LicenseNumber;
                    doctor.NationalIdNumber = profileData.NationalIdNumber;
                    doctor.LicenseProofUrl = profileData.LicenseProofUrl;
                    doctor.IdProofUrl = profileData.IdProofUrl;
                    doctor.DegreeProofUrl = profileData.DegreeProofUrl;
                    doctor.LicenseExpiryDate = profileData.LicenseExpiryDate;
                }

                if (!doctor.IsVerified)
                {
                    if (profileData.Specialties != null && profileData.Specialties.Any())
                    {
                        var requestedNames = profileData.Specialties
                            .Where(s => !string.IsNullOrWhiteSpace(s))
                            .Select(s => s.Trim())
                            .ToList();
                            
                        if (requestedNames.Distinct(StringComparer.OrdinalIgnoreCase).Count() != requestedNames.Count)
                        {
                            return ServiceResult<DoctorProfileDTO>.Failure("Duplicate specialties are not allowed.");
                        }

                        if (requestedNames.Count > 3)
                        {
                            return ServiceResult<DoctorProfileDTO>.Failure("A doctor can have a maximum of 3 specialties.");
                        }

                        var lowerRequestedNames = requestedNames.Select(s => s.ToLower()).ToList();
                        
                        var existingDbSpecialties = await dbContext.Specialties
                            .Where(s => lowerRequestedNames.Contains(s.Name.ToLower()))
                            .ToListAsync();

                        var existingDbSpecialtyIds = existingDbSpecialties.Select(s => s.SpecialtyId).ToList();
                        var currentSpecialtyIds = doctor.DoctorSpecialties.Select(ds => ds.SpecialtyId).ToList();

                        var toRemove = doctor.DoctorSpecialties.Where(ds => !existingDbSpecialtyIds.Contains(ds.SpecialtyId)).ToList();
                        var toAddIds = existingDbSpecialtyIds.Except(currentSpecialtyIds).ToList();

                        foreach (var ds in toRemove)
                        {
                            doctor.DoctorSpecialties.Remove(ds);
                        }

                        foreach (var id in toAddIds)
                        {
                            doctor.DoctorSpecialties.Add(new DoctorSpecialty
                            {
                                DoctorId = doctor.DoctorId,
                                SpecialtyId = id
                            });
                        }
                    }
                    else
                    {
                        doctor.DoctorSpecialties.Clear();
                    }
                }
                
                doctor.ClinicPrice = profileData.ClinicPrice;
                doctor.IsClinicEnabled = profileData.IsClinicEnabled;
                doctor.ChatPrice = profileData.ChatPrice;
                doctor.IsChatEnabled = profileData.IsChatEnabled;
                doctor.VideoPrice = profileData.VideoPrice;
                doctor.IsVideoEnabled = profileData.IsVideoEnabled;
                doctor.CallPrice = profileData.CallPrice;
                doctor.IsCallEnabled = profileData.IsCallEnabled;

                await dbContext.SaveChangesAsync();
                
                // Fetch again to get the full mapped properties
                return ServiceResult<DoctorProfileDTO>.Success((await GetProfile(userId))!);
            }
            catch (Exception ex)
            {
                return ServiceResult<DoctorProfileDTO>.Failure($"Failed to update profile: {ex.Message}");
            }
        }

         public async Task<DoctorDashboardDTO?> GetDashboard(string userId)
        {
            var doctor = await dbContext.DoctorProfiles
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null) return null;

            var chatSessions = await dbContext.ChatSessions
                .Include(cs => cs.Patient).ThenInclude(p => p.User)
                .Include(cs => cs.SymptomAnalysis)
                .Where(cs => cs.DoctorId == doctor.DoctorId && cs.Status == SessionStatus.Active)
                .OrderBy(cs => cs.StartedAt)
                .Take(10)
                .Select(cs => new ChatSessionDTO
                {
                    SessionId = cs.SessionId,
                    PatientName = cs.Patient.User.FullName,
                    SessionSummary = cs.SessionSummary,
                    StartedAt = cs.StartedAt
                })
                .ToListAsync();

            var todayStart = DateTime.UtcNow.Date;
            var todayEnd = todayStart.AddDays(1);

            var todaysAppointments = await dbContext.Appointments
                .Where(a => a.DoctorId == doctor.DoctorId && a.ScheduledAt >= todayStart && a.ScheduledAt < todayEnd)
                .OrderBy(a => a.ScheduledAt)
                .Select(a => new UpcomingAppointmentDTO
                {
                    AppointmentId = a.AppointmentId,
                    DoctorName = doctor.User.FullName,
                    ScheduledAt = a.ScheduledAt,
                    ConsultationType = a.ConsultationType.ToString(),
                    Status = a.Status.ToString()
                })
                .ToListAsync();

            var totalPatientsSeen = await dbContext.Appointments
                .Where(a => a.DoctorId == doctor.DoctorId && a.Status == AppointmentStatus.Completed)
                .Select(a => a.PatientId)
                .Distinct()
                .CountAsync();

            return new DoctorDashboardDTO
            {
                FullName = doctor.User.FullName,
                IsVerified = doctor.IsVerified,
                ChatSessionsCount = chatSessions.Count,
                TodaysAppointmentsCount = todaysAppointments.Count,
                TotalPatientsSeen = totalPatientsSeen,
                ChatSessions = chatSessions,
                TodaysAppointments = todaysAppointments
            };
        }


    }
}
