using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddOtherModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Client_Accounts_AccountId",
                table: "Client");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Client",
                table: "Client");

            migrationBuilder.RenameTable(
                name: "Client",
                newName: "Clients");

            migrationBuilder.RenameIndex(
                name: "IX_Client_AccountId",
                table: "Clients",
                newName: "IX_Clients_AccountId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Clients",
                table: "Clients",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Configurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MachineTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Configurations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MasterMachines",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MachineNumber = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    ConfigId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterMachines", x => x.id);
                    table.ForeignKey(
                        name: "FK_MasterMachines_Configurations_ConfigId",
                        column: x => x.ConfigId,
                        principalTable: "Configurations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Trays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConfigurationId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Trays_Configurations_ConfigurationId",
                        column: x => x.ConfigurationId,
                        principalTable: "Configurations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SatelliteMachine",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MasterMachineid = table.Column<int>(type: "int", nullable: true),
                    MachineNumber = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    ConfigId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SatelliteMachine", x => x.id);
                    table.ForeignKey(
                        name: "FK_SatelliteMachine_Configurations_ConfigId",
                        column: x => x.ConfigId,
                        principalTable: "Configurations",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SatelliteMachine_MasterMachines_MasterMachineid",
                        column: x => x.MasterMachineid,
                        principalTable: "MasterMachines",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Canals",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CanalNumber = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ExtractorId = table.Column<int>(type: "int", nullable: false),
                    CanalWidth = table.Column<float>(type: "real", nullable: false),
                    CanalHeight = table.Column<float>(type: "real", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    Settings = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrayId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Canals", x => x.id);
                    table.ForeignKey(
                        name: "FK_Canals_Extractor_ExtractorId",
                        column: x => x.ExtractorId,
                        principalTable: "Extractor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Canals_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Canals_Trays_TrayId",
                        column: x => x.TrayId,
                        principalTable: "Trays",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Canals_ExtractorId",
                table: "Canals",
                column: "ExtractorId");

            migrationBuilder.CreateIndex(
                name: "IX_Canals_ProductId",
                table: "Canals",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Canals_TrayId",
                table: "Canals",
                column: "TrayId");

            migrationBuilder.CreateIndex(
                name: "IX_MasterMachines_ConfigId",
                table: "MasterMachines",
                column: "ConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_SatelliteMachine_ConfigId",
                table: "SatelliteMachine",
                column: "ConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_SatelliteMachine_MasterMachineid",
                table: "SatelliteMachine",
                column: "MasterMachineid");

            migrationBuilder.CreateIndex(
                name: "IX_Trays_ConfigurationId",
                table: "Trays",
                column: "ConfigurationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Accounts_AccountId",
                table: "Clients",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Accounts_AccountId",
                table: "Clients");

            migrationBuilder.DropTable(
                name: "Canals");

            migrationBuilder.DropTable(
                name: "SatelliteMachine");

            migrationBuilder.DropTable(
                name: "Trays");

            migrationBuilder.DropTable(
                name: "MasterMachines");

            migrationBuilder.DropTable(
                name: "Configurations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Clients",
                table: "Clients");

            migrationBuilder.RenameTable(
                name: "Clients",
                newName: "Client");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_AccountId",
                table: "Client",
                newName: "IX_Client_AccountId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Client",
                table: "Client",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Client_Accounts_AccountId",
                table: "Client",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }
    }
}
