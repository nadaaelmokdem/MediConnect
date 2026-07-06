using Microsoft.EntityFrameworkCore;
using Tabibi.Data;
using Tabibi.DTOs;
using Tabibi.Models;
using Tabibi.Shared;
using System.Linq;

namespace Tabibi.Services
{
    public class PublicService(AppDbContext dbContext)
    {
        public async Task<PaginatedResultDTO<DoctorListDTO>> GetDoctorsAsync(DoctorSearchFilterDTO filter)
        {
            var query = dbContext.DoctorProfiles
                .Include(d => d.User)
                .Include(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
                .AsQueryable();

            // Filter out unverified doctors
            //query = query.Where(d => d.IsVerified);

            query = query.Where(d => d.DoctorSpecialties.Count != 0);

            if (filter.SpecialtyId.HasValue)
            {
                query = query.Where(d => d.DoctorSpecialties.Any(ds => ds.SpecialtyId == filter.SpecialtyId.Value));
            }

            // Price & Booking type filtering
            if (filter.MinPrice.HasValue || filter.MaxPrice.HasValue || (filter.BookingTypes != null && filter.BookingTypes.Any()))
            {
                var types = filter.BookingTypes ?? new List<ConsultationType> { ConsultationType.Clinic, ConsultationType.Chat, ConsultationType.Video, ConsultationType.Call };
                var min = filter.MinPrice ?? 0;
                var max = filter.MaxPrice ?? decimal.MaxValue;

                query = query.Where(d => d.DoctorSpecialties.Any(ds =>
                    (types.Contains(ConsultationType.Clinic) && ds.IsClinicEnabled && ds.ClinicPrice >= min && ds.ClinicPrice <= max) ||
                    (types.Contains(ConsultationType.Chat) && ds.IsChatEnabled && ds.ChatPrice >= min && ds.ChatPrice <= max) ||
                    (types.Contains(ConsultationType.Video) && ds.IsVideoEnabled && ds.VideoPrice >= min && ds.VideoPrice <= max) ||
                    (types.Contains(ConsultationType.Call) && ds.IsCallEnabled && ds.CallPrice >= min && ds.CallPrice <= max)
                ));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(d => d.AverageRating)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(d => new DoctorListDTO
                {
                    DoctorId = d.DoctorId,
                    FullName = d.User.FullName,
                    ProfilePictureUrl = d.ProfilePictureUrl,
                    AverageRating = d.AverageRating,
                    YearsOfExperience = d.YearsOfExperience,
                    ClinicLocation = d.ClinicLocation,
                    Bio = d.Bio,
                    Specialties = d.DoctorSpecialties.Select(ds => new DoctorListSpecialtyDTO
                    {
                        SpecialtyId = ds.SpecialtyId,
                        Name = ds.Specialty.Name,
                        ClinicPrice = ds.ClinicPrice,
                        ChatPrice = ds.ChatPrice,
                        VideoPrice = ds.VideoPrice,
                        CallPrice = ds.CallPrice
                    }).ToList()
                })
                .ToListAsync();

            return new PaginatedResultDTO<DoctorListDTO>
            {
                Items = items,
                TotalCount = totalCount,
                Page = filter.Page,
                PageSize = filter.PageSize
            };
        }
    }
}
