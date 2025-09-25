using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateElevatorDiscriminator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "53eb17f8-7da3-4d49-ad6f-9b58db9b6eba");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6d83b182-5fad-448f-a656-b0eb5162eb95");

            migrationBuilder.AlterColumn<string>(
                name: "ElevatorType",
                table: "ElevatorConfigs",
                type: "varchar(21)",
                maxLength: 21,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(34)",
                oldMaxLength: 34)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "b8598668-bf2d-45e1-bc0a-085e2659e062", null, "User", "USER" },
                    { "d719b679-5554-498d-8b30-35a148e7399c", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b8598668-bf2d-45e1-bc0a-085e2659e062");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d719b679-5554-498d-8b30-35a148e7399c");

            migrationBuilder.AlterColumn<string>(
                name: "ElevatorType",
                table: "ElevatorConfigs",
                type: "varchar(34)",
                maxLength: 34,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(21)",
                oldMaxLength: 21)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "53eb17f8-7da3-4d49-ad6f-9b58db9b6eba", null, "Admin", "ADMIN" },
                    { "6d83b182-5fad-448f-a656-b0eb5162eb95", null, "User", "USER" }
                });
        }
    }
}
