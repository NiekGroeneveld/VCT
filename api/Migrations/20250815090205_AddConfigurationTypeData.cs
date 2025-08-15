using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddConfigurationTypeData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Configurations_ConfigurationTypeDatas_ConfigurationTypeDataId",
                table: "Configurations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ConfigurationTypeDatas",
                table: "ConfigurationTypeDatas");

            migrationBuilder.RenameTable(
                name: "ConfigurationTypeDatas",
                newName: "ConfigurationTypeData");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Configurations",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConfigurationTypeData",
                table: "ConfigurationTypeData",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Configurations_ConfigurationTypeData_ConfigurationTypeDataId",
                table: "Configurations",
                column: "ConfigurationTypeDataId",
                principalTable: "ConfigurationTypeData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Configurations_ConfigurationTypeData_ConfigurationTypeDataId",
                table: "Configurations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ConfigurationTypeData",
                table: "ConfigurationTypeData");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Configurations");

            migrationBuilder.RenameTable(
                name: "ConfigurationTypeData",
                newName: "ConfigurationTypeDatas");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConfigurationTypeDatas",
                table: "ConfigurationTypeDatas",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Configurations_ConfigurationTypeDatas_ConfigurationTypeDataId",
                table: "Configurations",
                column: "ConfigurationTypeDataId",
                principalTable: "ConfigurationTypeDatas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
