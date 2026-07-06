using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Tabibi.Models;
using Tabibi.Shared;

namespace Tabibi.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(AppDbContext dbContext, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // 1. Ensure Roles are seeded (already done in Program.cs, but safety first)
            var roles = new[] { UserRoles.Patient, UserRoles.Doctor, UserRoles.Admin };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. Check if doctors are already seeded
            if (await userManager.FindByEmailAsync("ahmed.hassan@tabibi.com") != null)
            {
                return; // Already seeded
            }

            // Define the specialties we map to:
            // 1: Dermatology (Skin)
            // 4: Pediatrics and New Born (Child)
            // 5: Neurology (Brain & Nerves)
            // 6: Orthopedics (Bones)
            // 9: Cardiology and Vascular Disease (Heart)
            // 20: General Practice (General)
            // 34: Ophthalmology (Eyes)

            var mockDoctorsData = new[]
            {
                new { Name = "Ahmed Hassan", Email = "ahmed.hassan@tabibi.com", SpecialtyId = 9, ClinicLocation = "Nasr City, Cairo", YearsOfExperience = 10, Bio = "Specialist in interventional cardiology and heart failure management.", ClinicPrice = 350m, VideoPrice = 250m, CallPrice = 200m, ChatPrice = 150m,
                      Availabilities = new[] {
                          new { Day = DayOfWeek.Sunday, Start = "10:00", End = "12:00" },
                          new { Day = DayOfWeek.Monday, Start = "14:00", End = "16:00" },
                          new { Day = DayOfWeek.Wednesday, Start = "09:00", End = "11:00" }
                      }},
                new { Name = "Sara Mohamed", Email = "sara.mohamed@tabibi.com", SpecialtyId = 1, ClinicLocation = "Mohandessin, Giza", YearsOfExperience = 8, Bio = "Expert in medical and aesthetic dermatology.", ClinicPrice = 300m, VideoPrice = 220m, CallPrice = 180m, ChatPrice = 120m,
                      Availabilities = new[] {
                          new { Day = DayOfWeek.Monday, Start = "10:00", End = "11:00" },
                          new { Day = DayOfWeek.Tuesday, Start = "14:00", End = "16:00" },
                          new { Day = DayOfWeek.Thursday, Start = "09:00", End = "10:00" }
                      }},
                new { Name = "Omar Hassan", Email = "omar.hassan@tabibi.com", SpecialtyId = 4, ClinicLocation = "Smouha, Alexandria", YearsOfExperience = 15, Bio = "Dedicated pediatrician committed to child health.", ClinicPrice = 400m, VideoPrice = 300m, CallPrice = 250m, ChatPrice = 180m,
                      Availabilities = new[] {
                          new { Day = DayOfWeek.Sunday, Start = "09:00", End = "12:00" },
                          new { Day = DayOfWeek.Tuesday, Start = "15:00", End = "17:00" },
                          new { Day = DayOfWeek.Saturday, Start = "10:00", End = "12:00" }
                      }},
                new { Name = "Nour Ibrahim", Email = "nour.ibrahim@tabibi.com", SpecialtyId = 6, ClinicLocation = "Maadi, Cairo", YearsOfExperience = 12, Bio = "Orthopedic surgeon specializing in sports injuries.", ClinicPrice = 320m, VideoPrice = 230m, CallPrice = 190m, ChatPrice = 130m,
                      Availabilities = new[] {
                          new { Day = DayOfWeek.Wednesday, Start = "13:00", End = "16:00" },
                          new { Day = DayOfWeek.Friday, Start = "10:00", End = "13:00" }
                      }},
                new { Name = "Yasmine Farouk", Email = "yasmine.farouk@tabibi.com", SpecialtyId = 5, ClinicLocation = "Mansoura, Dakahlia", YearsOfExperience = 9, Bio = "Neurologist focused on headache disorders and epilepsy.", ClinicPrice = 380m, VideoPrice = 280m, CallPrice = 230m, ChatPrice = 160m,
                      Availabilities = new[] {
                          new { Day = DayOfWeek.Sunday, Start = "14:00", End = "16:00" },
                          new { Day = DayOfWeek.Monday, Start = "10:00", End = "13:00" },
                          new { Day = DayOfWeek.Thursday, Start = "16:00", End = "18:00" }
                      }},
                new { Name = "Karim Adel", Email = "karim.adel@tabibi.com", SpecialtyId = 1, ClinicLocation = "6th of October, Giza", YearsOfExperience = 6, Bio = "Dermatologist with expertise in laser therapy.", ClinicPrice = 280m, VideoPrice = 200m, CallPrice = 160m, ChatPrice = 110m,
                      Availabilities = new[] {
                          new { Day = DayOfWeek.Tuesday, Start = "11:00", End = "13:00" },
                          new { Day = DayOfWeek.Saturday, Start = "14:00", End = "17:00" }
                      }},
                new { Name = "Hana Sayed", Email = "hana.sayed@tabibi.com", SpecialtyId = 34, ClinicLocation = "Heliopolis, Cairo", YearsOfExperience = 11, Bio = "Ophthalmologist skilled in cataract surgery.", ClinicPrice = 420m, VideoPrice = 310m, CallPrice = 260m, ChatPrice = 190m,
                      Availabilities = new[] {
                          new { Day = DayOfWeek.Sunday, Start = "10:00", End = "13:00" },
                          new { Day = DayOfWeek.Wednesday, Start = "14:00", End = "16:00" },
                          new { Day = DayOfWeek.Friday, Start = "09:00", End = "12:00" }
                      }},
                new { Name = "Mostafa Ali", Email = "mostafa.ali@tabibi.com", SpecialtyId = 20, ClinicLocation = "Downtown, Cairo", YearsOfExperience = 5, Bio = "General practitioner providing comprehensive primary care.", ClinicPrice = 200m, VideoPrice = 150m, CallPrice = 120m, ChatPrice = 90m,
                      Availabilities = new[] {
                          new { Day = DayOfWeek.Monday, Start = "09:00", End = "13:00" },
                          new { Day = DayOfWeek.Tuesday, Start = "14:00", End = "17:00" },
                          new { Day = DayOfWeek.Thursday, Start = "09:00", End = "11:00" },
                          new { Day = DayOfWeek.Saturday, Start = "10:00", End = "13:00" }
                      }}
            };

            foreach (var doc in mockDoctorsData)
            {
                var user = await userManager.FindByEmailAsync(doc.Email);
                if (user == null)
                {
                    user = new AppUser
                    {
                        FullName = doc.Name,
                        Email = doc.Email,
                        UserName = doc.Email,
                        EmailConfirmed = true,
                        IsActive = true
                    };
                    var createResult = await userManager.CreateAsync(user, "Doctor123!");
                    if (!createResult.Succeeded)
                    {
                        throw new Exception($"Failed to create seed user {doc.Email}: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
                    }
                    await userManager.AddToRoleAsync(user, UserRoles.Doctor);
                }

                var profile = await dbContext.DoctorProfiles.FirstOrDefaultAsync(p => p.UserId == user.Id);
                if (profile == null)
                {
                    profile = new DoctorProfile
                    {
                        UserId = user.Id,
                        ClinicLocation = doc.ClinicLocation,
                        YearsOfExperience = doc.YearsOfExperience,
                        Bio = doc.Bio,
                        AverageRating = 4.8m,
                        IsVerified = true,
                        IsAvailableNow = true
                    };
                    dbContext.DoctorProfiles.Add(profile);
                    await dbContext.SaveChangesAsync(); // To get profile.DoctorId
                }

                // Add DoctorSpecialty link
                var docSpecialty = await dbContext.DoctorSpecialties.FirstOrDefaultAsync(ds => ds.DoctorId == profile.DoctorId && ds.SpecialtyId == doc.SpecialtyId);
                if (docSpecialty == null)
                {
                    docSpecialty = new DoctorSpecialty
                    {
                        DoctorId = profile.DoctorId,
                        SpecialtyId = doc.SpecialtyId,
                        ClinicPrice = doc.ClinicPrice,
                        IsClinicEnabled = true,
                        VideoPrice = doc.VideoPrice,
                        IsVideoEnabled = true,
                        CallPrice = doc.CallPrice,
                        IsCallEnabled = true,
                        ChatPrice = doc.ChatPrice,
                        IsChatEnabled = true
                    };
                    dbContext.DoctorSpecialties.Add(docSpecialty);
                }

                // Add Availabilities
                foreach (var av in doc.Availabilities)
                {
                    var startTime = TimeSpan.Parse(av.Start);
                    var endTime = TimeSpan.Parse(av.End);

                    var exists = await dbContext.DoctorAvailabilities.AnyAsync(da =>
                        da.DoctorId == profile.DoctorId &&
                        da.DayOfWeek == av.Day &&
                        da.StartTime == startTime &&
                        da.EndTime == endTime);

                    if (!exists)
                    {
                        dbContext.DoctorAvailabilities.Add(new DoctorAvailability
                        {
                            DoctorId = profile.DoctorId,
                            DayOfWeek = av.Day,
                            StartTime = startTime,
                            EndTime = endTime,
                            SlotDurationMins = 30,
                            IsActive = true
                        });
                    }
                }
            }

            // Also seed a default patient user for easy login/booking testing
            var patientEmail = "patient@tabibi.com";
            var patientUser = await userManager.FindByEmailAsync(patientEmail);
            if (patientUser == null)
            {
                patientUser = new AppUser
                {
                    FullName = "John Doe",
                    Email = patientEmail,
                    UserName = patientEmail,
                    EmailConfirmed = true,
                    IsActive = true
                };
                var createResult = await userManager.CreateAsync(patientUser, "Patient123!");
                if (createResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(patientUser, UserRoles.Patient);
                    
                    var patientProfile = new PatientProfile
                    {
                        UserId = patientUser.Id,
                        Age = 30,
                        Gender = GenderTypes.Male,
                        Height = 175,
                        Weight = 75,
                        Address = "Cairo, Egypt",
                        EmergencyContact = "0123456789"
                    };
                    dbContext.PatientProfiles.Add(patientProfile);
                }
            }

            await dbContext.SaveChangesAsync();
        }
    }
}
