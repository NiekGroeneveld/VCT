using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class MachineTypeRename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "SatelliteMachine",
                newName: "MachineType");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "MasterMachines",
                newName: "MachineType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MachineType",
                table: "SatelliteMachine",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "MachineType",
                table: "MasterMachines",
                newName: "Type");
        }
    }
}
