using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class TrayProductSurrogateKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "36120e15-6e2c-4f25-9b10-965d562b4761");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "da137b66-6bfe-4e6e-beb2-ae0c4e2db348");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1ff91d47-0d34-420e-9bd5-a204b5d5ef9f", null, "Admin", "ADMIN" },
                    { "fe188357-9819-4195-87df-176253e01221", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1ff91d47-0d34-420e-9bd5-a204b5d5ef9f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fe188357-9819-4195-87df-176253e01221");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "36120e15-6e2c-4f25-9b10-965d562b4761", null, "User", "USER" },
                    { "da137b66-6bfe-4e6e-beb2-ae0c4e2db348", null, "Admin", "ADMIN" }
                });
        }
    }
}
