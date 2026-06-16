using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Tabibi.Data;
using Tabibi.DTOs;
using Tabibi.Models;

namespace Tabibi.Services
{
    public class PatientService(AppDbContext dbContext)
    {
        public bool ValidatePatientExtras(PatientExtraDTO patientData)
        {
            string phonePattern = @"^\+?[\d\s-]{8,}$";
            bool error = false;

            // Age validation
            if (!string.IsNullOrEmpty(patientData.Age))
            {
                if (!double.TryParse(patientData.Age, out double age) || age < 1 || age > 120)
                {
                    error = true;
                }
            }

            // Weight validation
            if (!string.IsNullOrEmpty(patientData.Weight))
            {
                if (!double.TryParse(patientData.Weight, out double weight) || weight <= 0 || weight > 300)
                {
                    error = true;
                }
            }

            // Height validation
            if (!string.IsNullOrEmpty(patientData.Height))
            {
                if (!double.TryParse(patientData.Height, out double height) || height <= 0 || height > 300)
                {
                    error = true;
                }
            }

            // Emergency Phone validation
            if (!string.IsNullOrEmpty(patientData.EmergencyContact))
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(patientData.EmergencyContact, phonePattern))
                {
                    error = true;
                }
            }

            return !error;
        }

        public async Task<bool> UpdateData(PatientExtraDTO patientData)
        {
            var user = await dbContext.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == patientData.Id);

            if (user == null)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(patientData.Address))
                user.Address = patientData.Address;

            if (!string.IsNullOrEmpty(patientData.Age))
                user.Age = int.Parse(patientData.Age);

            if (!string.IsNullOrEmpty(patientData.Weight))
                user.Weight = double.Parse(patientData.Weight);

            if (!string.IsNullOrEmpty(patientData.Height))
                user.Height = double.Parse(patientData.Height);

            if (!string.IsNullOrEmpty(patientData.EmergencyContact))
                user.EmergencyContact = patientData.EmergencyContact;

            if (patientData.Gender is not null)
                user.Gender = patientData.Gender == "male" ? GenderTypes.Male : GenderTypes.Female;

            return true;
        }
    }
}
