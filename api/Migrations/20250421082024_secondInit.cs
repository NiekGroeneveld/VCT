using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class secondInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Canal");

            migrationBuilder.DropTable(
                name: "SatelliteMachine");

            migrationBuilder.DropTable(
                name: "Tray");

            migrationBuilder.DropTable(
                name: "MasterMachine");

            migrationBuilder.DropTable(
                name: "Configuration");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Configuration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MachineTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Configuration", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MasterMachine",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConfigId = table.Column<int>(type: "int", nullable: false),
                    AccountId = table.Column<int>(type: "int", nullable: true),
                    MachineNumber = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterMachine", x => x.id);
                    table.ForeignKey(
                        name: "FK_MasterMachine_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MasterMachine_Configuration_ConfigId",
                        column: x => x.ConfigId,
                        principalTable: "Configuration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tray",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConfigurationId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tray", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tray_Configuration_ConfigurationId",
                        column: x => x.ConfigurationId,
                        principalTable: "Configuration",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SatelliteMachine",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConfigId = table.Column<int>(type: "int", nullable: false),
                    MachineNumber = table.Column<int>(type: "int", nullable: false),
                    MasterMachineid = table.Column<int>(type: "int", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SatelliteMachine", x => x.id);
                    table.ForeignKey(
                        name: "FK_SatelliteMachine_Configuration_ConfigId",
                        column: x => x.ConfigId,
                        principalTable: "Configuration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SatelliteMachine_MasterMachine_MasterMachineid",
                        column: x => x.MasterMachineid,
                        principalTable: "MasterMachine",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Canal",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExtractorId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CanalHeight = table.Column<float>(type: "real", nullable: false),
                    CanalNumber = table.Column<int>(type: "int", nullable: false),
                    CanalWidth = table.Column<float>(type: "real", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    Settings = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrayId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Canal", x => x.id);
                    table.ForeignKey(
                        name: "FK_Canal_Extractor_ExtractorId",
                        column: x => x.ExtractorId,
                        principalTable: "Extractor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Canal_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Canal_Tray_TrayId",
                        column: x => x.TrayId,
                        principalTable: "Tray",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Canal_ExtractorId",
                table: "Canal",
                column: "ExtractorId");

            migrationBuilder.CreateIndex(
                name: "IX_Canal_ProductId",
                table: "Canal",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Canal_TrayId",
                table: "Canal",
                column: "TrayId");

            migrationBuilder.CreateIndex(
                name: "IX_MasterMachine_AccountId",
                table: "MasterMachine",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_MasterMachine_ConfigId",
                table: "MasterMachine",
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
                name: "IX_Tray_ConfigurationId",
                table: "Tray",
                column: "ConfigurationId");
        }
    }
}
