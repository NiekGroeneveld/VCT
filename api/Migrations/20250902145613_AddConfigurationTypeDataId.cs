using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddConfigurationTypeDataId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { "852f6f25-eae4-4ab3-977b-77a775646a37", null, "Admin", "ADMIN" },
                    { "c93f58bc-3af0-449e-a574-b7078f930350", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "852f6f25-eae4-4ab3-977b-77a775646a37");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c93f58bc-3af0-449e-a574-b7078f930350");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7184f648-32e8-4aa9-baee-29cc2d3e13a7", null, "Admin", "ADMIN" },
                    { "fdea8813-b01e-48b2-bccc-608d6b247041", null, "User", "USER" }
                });
        }
    }
}
