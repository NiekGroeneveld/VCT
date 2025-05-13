using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class MachinesFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SatelliteMachine_MasterMachines_MasterMachineid",
                table: "SatelliteMachine");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "SatelliteMachine");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "SatelliteMachine");

            migrationBuilder.RenameColumn(
                name: "MasterMachineid",
                table: "SatelliteMachine",
                newName: "MasterMachineId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "SatelliteMachine",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_SatelliteMachine_MasterMachineid",
                table: "SatelliteMachine",
                newName: "IX_SatelliteMachine_MasterMachineId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "MasterMachines",
                newName: "Id");

            migrationBuilder.AlterColumn<int>(
                name: "MasterMachineId",
                table: "SatelliteMachine",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SatelliteMachine_MasterMachines_MasterMachineId",
                table: "SatelliteMachine",
                column: "MasterMachineId",
                principalTable: "MasterMachines",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SatelliteMachine_MasterMachines_MasterMachineId",
                table: "SatelliteMachine");

            migrationBuilder.RenameColumn(
                name: "MasterMachineId",
                table: "SatelliteMachine",
                newName: "MasterMachineid");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "SatelliteMachine",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_SatelliteMachine_MasterMachineId",
                table: "SatelliteMachine",
                newName: "IX_SatelliteMachine_MasterMachineid");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "MasterMachines",
                newName: "id");

            migrationBuilder.AlterColumn<int>(
                name: "MasterMachineid",
                table: "SatelliteMachine",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "SatelliteMachine",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "SatelliteMachine",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SatelliteMachine_MasterMachines_MasterMachineid",
                table: "SatelliteMachine",
                column: "MasterMachineid",
                principalTable: "MasterMachines",
                principalColumn: "id");
        }
    }
}
