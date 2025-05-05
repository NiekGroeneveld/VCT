using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class FixClientNavigationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Accounts_AccountId",
                table: "Clients");

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "MasterMachines",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AccountId",
                table: "Clients",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ClientId",
                table: "Products",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_MasterMachines_ClientId",
                table: "MasterMachines",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Accounts_AccountId",
                table: "Clients",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MasterMachines_Clients_ClientId",
                table: "MasterMachines",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Clients_ClientId",
                table: "Products",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Accounts_AccountId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_MasterMachines_Clients_ClientId",
                table: "MasterMachines");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Clients_ClientId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ClientId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_MasterMachines_ClientId",
                table: "MasterMachines");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "MasterMachines");

            migrationBuilder.AlterColumn<int>(
                name: "AccountId",
                table: "Clients",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Accounts_AccountId",
                table: "Clients",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }
    }
}
