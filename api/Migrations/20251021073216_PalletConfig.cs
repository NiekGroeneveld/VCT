using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class PalletConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "00033200-177d-4755-967d-c665fccf214e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c03bf79c-0d05-4671-b89d-37c6777c939d");

            // Use CHANGE COLUMN for MariaDB/MySQL compatibility
            migrationBuilder.Sql("ALTER TABLE `Products` CHANGE COLUMN `isPublic` `IsPublic` tinyint(1) NOT NULL;");
            migrationBuilder.Sql("ALTER TABLE `Products` CHANGE COLUMN `ProductConfig` `PalletConfig` longtext CHARACTER SET utf8mb4 NOT NULL;");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "ab115794-ccef-4e03-aa76-dc37f958af32", null, "User", "USER" },
                    { "f08aa6ef-cf3c-4e1b-9a8c-d7b533ac2c86", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ab115794-ccef-4e03-aa76-dc37f958af32");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f08aa6ef-cf3c-4e1b-9a8c-d7b533ac2c86");

            // Use CHANGE COLUMN for MariaDB/MySQL compatibility
            migrationBuilder.Sql("ALTER TABLE `Products` CHANGE COLUMN `IsPublic` `isPublic` tinyint(1) NOT NULL;");
            migrationBuilder.Sql("ALTER TABLE `Products` CHANGE COLUMN `PalletConfig` `ProductConfig` longtext CHARACTER SET utf8mb4 NOT NULL;");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "00033200-177d-4755-967d-c665fccf214e", null, "User", "USER" },
                    { "c03bf79c-0d05-4671-b89d-37c6777c939d", null, "Admin", "ADMIN" }
                });
        }
    }
}
