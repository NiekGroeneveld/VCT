using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddInformationDoubleDotsElevatorIndicators : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "56fdc1d2-8b13-48a0-9ab4-bbc512d1d673");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d82130b4-2f15-47ad-8597-902ec6aa812e");

            migrationBuilder.AddColumn<string>(
                name: "DoubleDotPositions",
                table: "ConfigurationTypeData",
                type: "json",
                nullable: false,
                defaultValue: "[]")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ElevatorDotIndicators",
                table: "ConfigurationTypeData",
                type: "json",
                nullable: false,
                defaultValue: "[]")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5232896b-8338-4ed9-8f62-c435cc8115f0", null, "User", "USER" },
                    { "df5ff4d5-c7f6-425a-824c-6cca62f6fa9f", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5232896b-8338-4ed9-8f62-c435cc8115f0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "df5ff4d5-c7f6-425a-824c-6cca62f6fa9f");

            migrationBuilder.DropColumn(
                name: "DoubleDotPositions",
                table: "ConfigurationTypeData");

            migrationBuilder.DropColumn(
                name: "ElevatorDotIndicators",
                table: "ConfigurationTypeData");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "56fdc1d2-8b13-48a0-9ab4-bbc512d1d673", null, "Admin", "ADMIN" },
                    { "d82130b4-2f15-47ad-8597-902ec6aa812e", null, "User", "USER" }
                });
        }
    }
}
