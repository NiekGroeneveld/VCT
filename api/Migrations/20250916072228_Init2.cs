using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class Init2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "329e774d-f81b-46d2-8529-8ae7cb6bef46");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "911c6ff1-e785-4fee-adbc-06541de0e52b");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "31c93470-fa3f-4a53-87b1-032933cb700d", null, "User", "USER" },
                    { "35ae8e18-9eac-4c7d-ae20-7e3b25b7801c", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "31c93470-fa3f-4a53-87b1-032933cb700d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "35ae8e18-9eac-4c7d-ae20-7e3b25b7801c");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "329e774d-f81b-46d2-8529-8ae7cb6bef46", null, "Admin", "ADMIN" },
                    { "911c6ff1-e785-4fee-adbc-06541de0e52b", null, "User", "USER" }
                });
        }
    }
}
