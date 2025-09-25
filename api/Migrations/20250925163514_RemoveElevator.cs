using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveElevator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "13728228-5823-475b-b8a1-ac2d4b314f73");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c07f8d9b-5967-476e-90b8-a13e3066a491");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "56fdc1d2-8b13-48a0-9ab4-bbc512d1d673", null, "Admin", "ADMIN" },
                    { "d82130b4-2f15-47ad-8597-902ec6aa812e", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "56fdc1d2-8b13-48a0-9ab4-bbc512d1d673");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d82130b4-2f15-47ad-8597-902ec6aa812e");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "13728228-5823-475b-b8a1-ac2d4b314f73", null, "User", "USER" },
                    { "c07f8d9b-5967-476e-90b8-a13e3066a491", null, "Admin", "ADMIN" }
                });
        }
    }
}
