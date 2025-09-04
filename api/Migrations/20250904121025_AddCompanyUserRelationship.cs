using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyUserRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "48efd3ae-7832-4312-a698-c9fbc495b9f2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7c75b684-da70-49e0-864d-2ab362318232");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5f4de4f1-2da0-4f0b-b9a3-bda4d0cdd686", null, "Admin", "ADMIN" },
                    { "67cf985f-b964-404d-b387-ee93f8d06147", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5f4de4f1-2da0-4f0b-b9a3-bda4d0cdd686");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "67cf985f-b964-404d-b387-ee93f8d06147");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "48efd3ae-7832-4312-a698-c9fbc495b9f2", null, "User", "USER" },
                    { "7c75b684-da70-49e0-864d-2ab362318232", null, "Admin", "ADMIN" }
                });
        }
    }
}
