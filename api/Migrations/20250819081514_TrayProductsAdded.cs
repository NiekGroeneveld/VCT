using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class TrayProductsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Companies_companyId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "ProductTray");

            migrationBuilder.RenameColumn(
                name: "companyId",
                table: "Products",
                newName: "CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_Products_companyId",
                table: "Products",
                newName: "IX_Products_CompanyId");

            migrationBuilder.CreateTable(
                name: "TrayProducts",
                columns: table => new
                {
                    TrayId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false),
                    ProductChannelPosition = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrayProducts", x => new { x.TrayId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_TrayProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrayProducts_Trays_TrayId",
                        column: x => x.TrayId,
                        principalTable: "Trays",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_TrayProducts_ProductId",
                table: "TrayProducts",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Companies_CompanyId",
                table: "Products",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Companies_CompanyId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "TrayProducts");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "Products",
                newName: "companyId");

            migrationBuilder.RenameIndex(
                name: "IX_Products_CompanyId",
                table: "Products",
                newName: "IX_Products_companyId");

            migrationBuilder.CreateTable(
                name: "ProductTray",
                columns: table => new
                {
                    ProductsId = table.Column<int>(type: "int", nullable: false),
                    TraysId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductTray", x => new { x.ProductsId, x.TraysId });
                    table.ForeignKey(
                        name: "FK_ProductTray_Products_ProductsId",
                        column: x => x.ProductsId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductTray_Trays_TraysId",
                        column: x => x.TraysId,
                        principalTable: "Trays",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTray_TraysId",
                table: "ProductTray",
                column: "TraysId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Companies_companyId",
                table: "Products",
                column: "companyId",
                principalTable: "Companies",
                principalColumn: "Id");
        }
    }
}
