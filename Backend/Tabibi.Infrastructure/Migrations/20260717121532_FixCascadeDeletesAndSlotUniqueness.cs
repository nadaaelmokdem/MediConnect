using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tabibi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeDeletesAndSlotUniqueness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorProfiles_AspNetUsers_UserId",
                table: "DoctorProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorReviews_Appointments_AppointmentId",
                table: "DoctorReviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_DoctorId",
                table: "Appointments");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId_ScheduledAt",
                table: "Appointments",
                columns: new[] { "DoctorId", "ScheduledAt" },
                unique: true,
                filter: "[Status] <> 3");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorProfiles_AspNetUsers_UserId",
                table: "DoctorProfiles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorReviews_Appointments_AppointmentId",
                table: "DoctorReviews",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorProfiles_AspNetUsers_UserId",
                table: "DoctorProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorReviews_Appointments_AppointmentId",
                table: "DoctorReviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_DoctorId_ScheduledAt",
                table: "Appointments");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId",
                table: "Appointments",
                column: "DoctorId");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorProfiles_AspNetUsers_UserId",
                table: "DoctorProfiles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorReviews_Appointments_AppointmentId",
                table: "DoctorReviews",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
