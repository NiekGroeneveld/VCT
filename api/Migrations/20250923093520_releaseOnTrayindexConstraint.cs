using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class releaseOnTrayindexConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ensure there is an index on TrayId for the FK before dropping the composite unique index
            migrationBuilder.CreateIndex(
                name: "IX_TrayProducts_TrayId",
                table: "TrayProducts",
                column: "TrayId");

            migrationBuilder.DropIndex(
                name: "IX_TrayProducts_TrayId_OnTrayIndex",
                table: "TrayProducts");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1ff91d47-0d34-420e-9bd5-a204b5d5ef9f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fe188357-9819-4195-87df-176253e01221");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "592b35b0-080f-4036-88f0-d1db0dda9827", null, "Admin", "ADMIN" },
                    { "c7a550ed-5695-4aca-8037-358cfe81c18a", null, "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_TrayProducts_TrayId_OnTrayIndex",
                table: "TrayProducts",
                columns: new[] { "TrayId", "OnTrayIndex" });

            // Drop the temporary single-column index now that the composite index is recreated
            migrationBuilder.DropIndex(
                name: "IX_TrayProducts_TrayId",
                table: "TrayProducts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TrayProducts_TrayId_OnTrayIndex",
                table: "TrayProducts");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "592b35b0-080f-4036-88f0-d1db0dda9827");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c7a550ed-5695-4aca-8037-358cfe81c18a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1ff91d47-0d34-420e-9bd5-a204b5d5ef9f", null, "Admin", "ADMIN" },
                    { "fe188357-9819-4195-87df-176253e01221", null, "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_TrayProducts_TrayId_OnTrayIndex",
                table: "TrayProducts",
                columns: new[] { "TrayId", "OnTrayIndex" },
                unique: true);

            migrationBuilder.DropIndex(
                name: "IX_TrayProducts_TrayId",
                table: "TrayProducts");
        }
    }
}
