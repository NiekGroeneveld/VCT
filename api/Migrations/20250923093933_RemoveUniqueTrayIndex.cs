using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUniqueTrayIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "592b35b0-080f-4036-88f0-d1db0dda9827");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c7a550ed-5695-4aca-8037-358cfe81c18a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "088c7d72-c6df-4a1c-ae54-be38d38fbc1f", null, "Admin", "ADMIN" },
                    { "7c92e7a2-d12b-467e-a5b7-f4c980647216", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "088c7d72-c6df-4a1c-ae54-be38d38fbc1f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7c92e7a2-d12b-467e-a5b7-f4c980647216");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "592b35b0-080f-4036-88f0-d1db0dda9827", null, "Admin", "ADMIN" },
                    { "c7a550ed-5695-4aca-8037-358cfe81c18a", null, "User", "USER" }
                });
        }
    }
}
