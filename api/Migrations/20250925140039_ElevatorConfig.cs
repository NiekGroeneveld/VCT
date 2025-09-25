using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ElevatorConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "088c7d72-c6df-4a1c-ae54-be38d38fbc1f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7c92e7a2-d12b-467e-a5b7-f4c980647216");

            migrationBuilder.AddColumn<int>(
                name: "ElevatorConfigId",
                table: "Configurations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ElevatorConfigs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ElevatorType = table.Column<string>(type: "varchar(34)", maxLength: 34, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ElevatorSetting = table.Column<int>(type: "int", nullable: true),
                    ElevatorAssecories = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
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
                    { "53eb17f8-7da3-4d49-ad6f-9b58db9b6eba", null, "Admin", "ADMIN" },
                    { "6d83b182-5fad-448f-a656-b0eb5162eb95", null, "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Configurations_ElevatorConfigId",
                table: "Configurations",
                column: "ElevatorConfigId");

            migrationBuilder.AddForeignKey(
                name: "FK_Configurations_ElevatorConfigs_ElevatorConfigId",
                table: "Configurations",
                column: "ElevatorConfigId",
                principalTable: "ElevatorConfigs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Configurations_ElevatorConfigs_ElevatorConfigId",
                table: "Configurations");

            migrationBuilder.DropTable(
                name: "ElevatorConfigs");

            migrationBuilder.DropIndex(
                name: "IX_Configurations_ElevatorConfigId",
                table: "Configurations");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "53eb17f8-7da3-4d49-ad6f-9b58db9b6eba");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6d83b182-5fad-448f-a656-b0eb5162eb95");

            migrationBuilder.DropColumn(
                name: "ElevatorConfigId",
                table: "Configurations");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "088c7d72-c6df-4a1c-ae54-be38d38fbc1f", null, "Admin", "ADMIN" },
                    { "7c92e7a2-d12b-467e-a5b7-f4c980647216", null, "User", "USER" }
                });
        }
    }
}
