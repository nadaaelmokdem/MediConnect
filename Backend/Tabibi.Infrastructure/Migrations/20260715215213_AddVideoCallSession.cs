using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tabibi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVideoCallSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "VideoCallSessionId",
                table: "Appointments",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VideoCallSessions",
                columns: table => new
                {
                    SessionId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<long>(type: "bigint", nullable: false),
                    DoctorId = table.Column<long>(type: "bigint", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VideoCallSessions", x => x.SessionId);
                    table.ForeignKey(
                        name: "FK_VideoCallSessions_DoctorProfiles_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "DoctorProfiles",
                        principalColumn: "DoctorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VideoCallSessions_PatientProfiles_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientProfiles",
                        principalColumn: "PatientId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_VideoCallSessionId",
                table: "Appointments",
                column: "VideoCallSessionId",
                unique: true,
                filter: "[VideoCallSessionId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_VideoCallSessions_DoctorId",
                table: "VideoCallSessions",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_VideoCallSessions_PatientId",
                table: "VideoCallSessions",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_VideoCallSessions_VideoCallSessionId",
                table: "Appointments",
                column: "VideoCallSessionId",
                principalTable: "VideoCallSessions",
                principalColumn: "SessionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_VideoCallSessions_VideoCallSessionId",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "VideoCallSessions");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_VideoCallSessionId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "VideoCallSessionId",
                table: "Appointments");
        }
    }
}
