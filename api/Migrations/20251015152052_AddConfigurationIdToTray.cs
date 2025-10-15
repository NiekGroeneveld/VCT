using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddConfigurationIdToTray : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5232896b-8338-4ed9-8f62-c435cc8115f0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "df5ff4d5-c7f6-425a-824c-6cca62f6fa9f");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "00033200-177d-4755-967d-c665fccf214e", null, "User", "USER" },
                    { "c03bf79c-0d05-4671-b89d-37c6777c939d", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "00033200-177d-4755-967d-c665fccf214e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c03bf79c-0d05-4671-b89d-37c6777c939d");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5232896b-8338-4ed9-8f62-c435cc8115f0", null, "User", "USER" },
                    { "df5ff4d5-c7f6-425a-824c-6cca62f6fa9f", null, "Admin", "ADMIN" }
                });
        }
    }
}
