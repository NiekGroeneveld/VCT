using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class MachineTypeSpecsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trays_Configurations_ConfigurationId",
                table: "Trays");

            migrationBuilder.AlterColumn<int>(
                name: "ConfigurationId",
                table: "Trays",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Dividers",
                table: "Trays",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<int>(
                name: "TrayNumber",
                table: "Trays",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TrayPosition",
                table: "Trays",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MachineTypeSpecs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MachineType = table.Column<int>(type: "int", nullable: false),
                    WidthTray = table.Column<int>(type: "int", nullable: false),
                    Height = table.Column<int>(type: "int", nullable: false),
                    Dots = table.Column<int>(type: "int", nullable: false),
                    Characteristics = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MachineTypeSpecs", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Trays_Configurations_ConfigurationId",
                table: "Trays",
                column: "ConfigurationId",
                principalTable: "Configurations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trays_Configurations_ConfigurationId",
                table: "Trays");

            migrationBuilder.DropTable(
                name: "MachineTypeSpecs");

            migrationBuilder.DropColumn(
                name: "Dividers",
                table: "Trays");

            migrationBuilder.DropColumn(
                name: "TrayNumber",
                table: "Trays");

            migrationBuilder.DropColumn(
                name: "TrayPosition",
                table: "Trays");

            migrationBuilder.AlterColumn<int>(
                name: "ConfigurationId",
                table: "Trays",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Trays_Configurations_ConfigurationId",
                table: "Trays",
                column: "ConfigurationId",
                principalTable: "Configurations",
                principalColumn: "Id");
        }
    }
}
