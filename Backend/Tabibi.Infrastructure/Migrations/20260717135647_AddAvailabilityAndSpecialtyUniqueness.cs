using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tabibi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAvailabilityAndSpecialtyUniqueness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DoctorSpecialties_DoctorId",
                table: "DoctorSpecialties");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSpecialties_DoctorId_SpecialtyId",
                table: "DoctorSpecialties",
                columns: new[] { "DoctorId", "SpecialtyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorAvailabilities_DoctorId_DayOfWeek_StartTime_EndTime",
                table: "DoctorAvailabilities",
                columns: new[] { "DoctorId", "DayOfWeek", "StartTime", "EndTime" },
                unique: true,
                filter: "[SpecificDate] IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorAvailabilities_DoctorId_SpecificDate_StartTime_EndTime",
                table: "DoctorAvailabilities",
                columns: new[] { "DoctorId", "SpecificDate", "StartTime", "EndTime" },
                unique: true,
                filter: "[SpecificDate] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DoctorSpecialties_DoctorId_SpecialtyId",
                table: "DoctorSpecialties");

            migrationBuilder.DropIndex(
                name: "IX_DoctorAvailabilities_DoctorId_DayOfWeek_StartTime_EndTime",
                table: "DoctorAvailabilities");

            migrationBuilder.DropIndex(
                name: "IX_DoctorAvailabilities_DoctorId_SpecificDate_StartTime_EndTime",
                table: "DoctorAvailabilities");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSpecialties_DoctorId",
                table: "DoctorSpecialties",
                column: "DoctorId");
        }
    }
}
