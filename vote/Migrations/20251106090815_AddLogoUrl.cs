using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace vote.Migrations
{
    /// <inheritdoc />
    public partial class AddLogoUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Parties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 2,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 3,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 4,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 5,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 6,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 7,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 8,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 9,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 10,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 11,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 12,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 13,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 14,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 15,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 16,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 17,
                column: "LogoUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 18,
                column: "LogoUrl",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Parties");
        }
    }
}
