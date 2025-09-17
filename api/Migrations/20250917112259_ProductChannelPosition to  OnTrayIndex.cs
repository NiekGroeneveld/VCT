using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ProductChannelPositiontoOnTrayIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "31c93470-fa3f-4a53-87b1-032933cb700d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "35ae8e18-9eac-4c7d-ae20-7e3b25b7801c");

            migrationBuilder.RenameColumn(
                name: "ProductChannelPosition",
                table: "TrayProducts",
                newName: "OnTrayIndex");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "34dfc523-f57d-41df-accb-c7955f24585a", null, "User", "USER" },
                    { "bdc5b470-ea24-411f-9733-45a595d636d1", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "34dfc523-f57d-41df-accb-c7955f24585a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bdc5b470-ea24-411f-9733-45a595d636d1");

            migrationBuilder.RenameColumn(
                name: "OnTrayIndex",
                table: "TrayProducts",
                newName: "ProductChannelPosition");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "31c93470-fa3f-4a53-87b1-032933cb700d", null, "User", "USER" },
                    { "35ae8e18-9eac-4c7d-ae20-7e3b25b7801c", null, "Admin", "ADMIN" }
                });
        }
    }
}
