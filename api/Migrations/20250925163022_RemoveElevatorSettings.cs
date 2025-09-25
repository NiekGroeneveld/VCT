using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveElevatorSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Configurations_ElevatorConfigs_ElevatorConfigId",
                table: "Configurations");

            migrationBuilder.DropIndex(
                name: "IX_Configurations_ElevatorConfigId",
                table: "Configurations");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b8598668-bf2d-45e1-bc0a-085e2659e062");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d719b679-5554-498d-8b30-35a148e7399c");

            migrationBuilder.Sql("ALTER TABLE `Configurations` CHANGE `ElevatorConfigId` `ElevatorSetting` int NULL;");

            migrationBuilder.AddColumn<string>(
                name: "ElevatorAddition",
                table: "Configurations",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "13728228-5823-475b-b8a1-ac2d4b314f73", null, "User", "USER" },
                    { "c07f8d9b-5967-476e-90b8-a13e3066a491", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "13728228-5823-475b-b8a1-ac2d4b314f73");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c07f8d9b-5967-476e-90b8-a13e3066a491");

            migrationBuilder.DropColumn(
                name: "ElevatorAddition",
                table: "Configurations");

            migrationBuilder.Sql("ALTER TABLE `Configurations` CHANGE `ElevatorSetting` `ElevatorConfigId` int NULL;");

            migrationBuilder.CreateTable(
                name: "ElevatorConfigs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ElevatorType = table.Column<string>(type: "varchar(21)", maxLength: 21, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ElevatorAssecories = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ElevatorSetting = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ElevatorConfigs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "b8598668-bf2d-45e1-bc0a-085e2659e062", null, "User", "USER" },
                    { "d719b679-5554-498d-8b30-35a148e7399c", null, "Admin", "ADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Configurations_ElevatorConfigId",
                table: "Configurations",
                column: "ElevatorConfigId");
        }
    }
}
