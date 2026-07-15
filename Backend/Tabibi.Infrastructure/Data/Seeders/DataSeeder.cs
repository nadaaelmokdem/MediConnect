using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Tabibi.Application.Interfaces;
using Tabibi.Core.Models;
using Tabibi.Application.Shared;

namespace Tabibi.Infrastructure.Data.Seeders
{
    public class DataSeeder : IDataSeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public DataSeeder(
            RoleManager<IdentityRole> roleManager,
            UserManager<AppUser> userManager,
            AppDbContext context,
            IConfiguration configuration)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _context = context;
            _configuration = configuration;
        }

        public async Task SeedAllAsync()
        {
            await SeedRolesAndAdminAsync();
            await SeedSpecialtiesAsync();
        }

        private async Task SeedRolesAndAdminAsync()
        {
            if (!await _roleManager.RoleExistsAsync(UserRoles.Patient))
            {
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Patient));
            }

            if (!await _roleManager.RoleExistsAsync(UserRoles.Doctor))
            {
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Doctor));
            }

            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
            }

            var existingAdmins = await _userManager.GetUsersInRoleAsync(UserRoles.Admin);
            if (existingAdmins.Count == 0)
            {
                var adminEmail = _configuration["AdminSeed:Email"] ?? "admin@admin.com";
                var adminPassword = _configuration["AdminSeed:Password"] ?? "Admin@123";
                var adminFullName = _configuration["AdminSeed:FullName"] ?? "Admin";

                if (!string.IsNullOrEmpty(adminEmail) && !string.IsNullOrEmpty(adminPassword))
                {
                    var existingUser = await _userManager.FindByEmailAsync(adminEmail);
                    if (existingUser != null)
                    {
                        if (!await _userManager.IsInRoleAsync(existingUser, UserRoles.Admin))
                        {
                            await _userManager.AddToRoleAsync(existingUser, UserRoles.Admin);
                        }
                    }
                    else
                    {
                        var adminUser = new AppUser
                        {
                            UserName = adminEmail,
                            Email = adminEmail,
                            FullName = adminFullName,
                            EmailConfirmed = true,
                            PhoneNumber = "0000000000",
                            PhoneNumberConfirmed = true
                        };

                        var createResult = await _userManager.CreateAsync(adminUser, adminPassword);
                        if (createResult.Succeeded)
                        {
                            await _userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
                        }
                    }
                }
            }
        }

        private async Task SeedSpecialtiesAsync()
        {
            var predefinedSpecialties = new List<Specialty>
            {
                new Specialty { SpecialtyId = 1, Name = "Dermatology (Skin)" },
                new Specialty { SpecialtyId = 2, Name = "Dentistry (Teeth)" },
                new Specialty { SpecialtyId = 3, Name = "Psychiatry (Mental Health)" },
                new Specialty { SpecialtyId = 4, Name = "Pediatrics and New Born (Child)" },
                new Specialty { SpecialtyId = 5, Name = "Neurology (Brain & Nerves)" },
                new Specialty { SpecialtyId = 6, Name = "Orthopedics (Bones)" },
                new Specialty { SpecialtyId = 7, Name = "Gynaecology and Infertility (Women's Health)" },
                new Specialty { SpecialtyId = 8, Name = "Ear, Nose and Throat (ENT)" },
                new Specialty { SpecialtyId = 9, Name = "Cardiology and Vascular Disease (Heart)" },
                new Specialty { SpecialtyId = 10, Name = "Allergy and Immunology (Immune System)" },
                new Specialty { SpecialtyId = 11, Name = "Andrology and Male Infertility (Men's Health)" },
                new Specialty { SpecialtyId = 12, Name = "Audiology (Hearing)" },
                new Specialty { SpecialtyId = 13, Name = "Cardiology and Thoracic Surgery (Heart & Chest)" },
                new Specialty { SpecialtyId = 14, Name = "Chest and Respiratory (Lungs)" },
                new Specialty { SpecialtyId = 15, Name = "Diabetes and Endocrinology (Glands & Hormones)" },
                new Specialty { SpecialtyId = 16, Name = "Diagnostic Radiology (X-Ray/Imaging)" },
                new Specialty { SpecialtyId = 17, Name = "Dietitian and Nutrition (Diet)" },
                new Specialty { SpecialtyId = 18, Name = "Family Medicine (General Practice)" },
                new Specialty { SpecialtyId = 19, Name = "Gastroenterology and Endoscopy (Digestive System)" },
                new Specialty { SpecialtyId = 20, Name = "General Practice (General)" },
                new Specialty { SpecialtyId = 21, Name = "General Surgery (Surgery)" },
                new Specialty { SpecialtyId = 22, Name = "Geriatrics (Elderly Care)" },
                new Specialty { SpecialtyId = 23, Name = "Hematology (Blood)" },
                new Specialty { SpecialtyId = 24, Name = "Hepatology (Liver)" },
                new Specialty { SpecialtyId = 25, Name = "Internal Medicine (Internal Organs)" },
                new Specialty { SpecialtyId = 26, Name = "Interventional Radiology (Imaging/Procedures)" },
                new Specialty { SpecialtyId = 27, Name = "IVF and Infertility (Fertility)" },
                new Specialty { SpecialtyId = 28, Name = "Laboratories (Lab Tests)" },
                new Specialty { SpecialtyId = 29, Name = "Nephrology (Kidneys)" },
                new Specialty { SpecialtyId = 30, Name = "Neurosurgery (Brain & Spine Surgery)" },
                new Specialty { SpecialtyId = 31, Name = "Obesity and Laparoscopic Surgery (Weight Loss)" },
                new Specialty { SpecialtyId = 32, Name = "Oncology (Cancer)" },
                new Specialty { SpecialtyId = 33, Name = "Oncology Surgery (Cancer Surgery)" },
                new Specialty { SpecialtyId = 34, Name = "Ophthalmology (Eyes)" },
                new Specialty { SpecialtyId = 35, Name = "Osteopathy (Bone & Muscle System)" },
                new Specialty { SpecialtyId = 36, Name = "Pain Management (Pain Relief)" },
                new Specialty { SpecialtyId = 37, Name = "Pediatric Surgery (Child Surgery)" },
                new Specialty { SpecialtyId = 38, Name = "Phoniatrics (Speech & Voice)" },
                new Specialty { SpecialtyId = 39, Name = "Physiotherapy and Sport Injuries (Physical Therapy)" },
                new Specialty { SpecialtyId = 40, Name = "Plastic Surgery (Cosmetic Surgery)" },
                new Specialty { SpecialtyId = 41, Name = "Rheumatology (Joints & Muscles)" },
                new Specialty { SpecialtyId = 42, Name = "Spinal Surgery (Spine)" },
                new Specialty { SpecialtyId = 43, Name = "Urology (Urinary Tract)" },
                new Specialty { SpecialtyId = 44, Name = "Vascular Surgery (Blood Vessels)" }
            };

            foreach (var specialty in predefinedSpecialties)
            {
                if (!await _context.Specialties.AnyAsync(s => s.SpecialtyId == specialty.SpecialtyId))
                {
                    _context.Specialties.Add(specialty);
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
