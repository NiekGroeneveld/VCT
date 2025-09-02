using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class hi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1a80ee5a-c0bc-4311-95f3-a96515e55fe2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cd344270-6ef2-4d90-b102-87a0da019331");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7184f648-32e8-4aa9-baee-29cc2d3e13a7", null, "Admin", "ADMIN" },
                    { "fdea8813-b01e-48b2-bccc-608d6b247041", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7184f648-32e8-4aa9-baee-29cc2d3e13a7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fdea8813-b01e-48b2-bccc-608d6b247041");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1a80ee5a-c0bc-4311-95f3-a96515e55fe2", null, "Admin", "ADMIN" },
                    { "cd344270-6ef2-4d90-b102-87a0da019331", null, "User", "USER" }
                });
        }
    }
}
