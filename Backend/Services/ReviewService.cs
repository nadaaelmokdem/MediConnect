using Microsoft.EntityFrameworkCore;
using Tabibi.Data;
using Tabibi.DTOs;
using Tabibi.Models;
using Tabibi.Shared;

namespace Tabibi.Services
{
    public class ReviewService(AppDbContext dbContext)
    {
        public async Task<ServiceResult<PagedReviewsDTO>> GetDoctorReviewsAsync(int doctorId, int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            var query = dbContext.DoctorReviews
                .Include(r => r.Appointment)
                .ThenInclude(a => a.Patient)
                .ThenInclude(p => p.User)
                .Where(r => r.Appointment.DoctorId == doctorId);

            var totalCount = await query.CountAsync();

            double averageRating = 0;
            if (totalCount > 0)
            {
                averageRating = await query.AverageAsync(r => r.Rating);
            }

            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new DoctorReviewDTO
                {
                    ReviewId = r.ReviewId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    PatientName = r.Appointment.Patient.User.FullName,
                    CreatedAt = r.CreatedAt,
                    ConsultationType = r.Appointment.ConsultationType
                })
                .ToListAsync();

            return ServiceResult<PagedReviewsDTO>.Success(new PagedReviewsDTO
            {
                Reviews = reviews,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                AverageRating = Math.Round(averageRating, 1)
            });
        }

        public async Task<ServiceResult> SubmitReviewAsync(string userId, CreateReviewDTO dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return ServiceResult.Failure("Rating must be between 1 and 5.");
            }

            var patient = await dbContext.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return ServiceResult.Failure("Patient profile not found.");

            var appointment = await dbContext.Appointments
                .Include(a => a.Review)
                .FirstOrDefaultAsync(a => a.AppointmentId == dto.AppointmentId);

            if (appointment == null)
            {
                return ServiceResult.Failure("Appointment not found.");
            }

            if (appointment.PatientId != patient.PatientId)
            {
                return ServiceResult.Failure("You can only review your own appointments.");
            }

            if (appointment.Status != AppointmentStatus.Completed)
            {
                return ServiceResult.Failure("You can only review completed appointments.");
            }

            var doctorId = appointment.DoctorId;
            var doctor = await dbContext.DoctorProfiles.FirstOrDefaultAsync(d => d.DoctorId == doctorId);
            
            if (doctor != null)
            {
                var oldRating = appointment.Review?.Rating;

                if (appointment.Review != null)
                {
                    // It's an update
                    if (doctor.ReviewCount > 0)
                    {
                        doctor.AverageRating = ((doctor.AverageRating * doctor.ReviewCount) - (decimal)oldRating! + (decimal)dto.Rating) / doctor.ReviewCount;
                    }
                    appointment.Review.Rating = dto.Rating;
                    appointment.Review.Comment = dto.Comment;
                }
                else
                {
                    // It's a new review
                    doctor.AverageRating = ((doctor.AverageRating * doctor.ReviewCount) + (decimal)dto.Rating) / (doctor.ReviewCount + 1);
                    doctor.ReviewCount++;

                    var review = new DoctorReview
                    {
                        AppointmentId = dto.AppointmentId,
                        Rating = dto.Rating,
                        Comment = dto.Comment
                    };

                    dbContext.DoctorReviews.Add(review);
                }

                await dbContext.SaveChangesAsync();
            }

            return ServiceResult.Success();
        }
    }
}
