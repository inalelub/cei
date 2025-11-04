using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace vote.Migrations
{
    /// <inheritdoc />
    public partial class AddPartiesSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Parties",
                columns: new[] { "Id", "PartyAbbreviation", "PartyName", "PartyUrl" },
                values: new object[,]
                {
                    { 1, 0, "African Christian Democratic Party", "https://www.acdp.org.za" },
                    { 2, 1, "ActionSA", "https://www.actionsa.org.za" },
                    { 3, 2, "Al Jama-ah", "https://www.aljama-ah.org.za" },
                    { 4, 3, "African National Congress", "https://www.anc1912.org.za" },
                    { 5, 4, "African Transformation Movement", "https://www.atm.org.za" },
                    { 6, 5, "Build One South Africa", "https://www.buildsa.org.za" },
                    { 7, 6, "Democratic Alliance", "https://www.da.org.za" },
                    { 8, 7, "Economic Freedom Fighters", "https://www.effonline.org" },
                    { 9, 8, "Freedom Front Plus", "https://www.vfplus.org.za" },
                    { 10, 9, "GOOD", "https://www.good.org.za" },
                    { 11, 10, "Inkatha Freedom Party", "https://www.ifp.org.za" },
                    { 12, 11, "National Coloured Congress", "https://www.nccsa.org.za" },
                    { 13, 12, "Patriotic Alliance", "https://www.pa.org.za" },
                    { 14, 13, "Pan Africanist Congress", "https://www.pac.org.za" },
                    { 15, 14, "Rise Mzansi", "https://www.risemzansi.org.za" },
                    { 16, 16, "Umkhonto We Sizwe", "https://www.umkhontowesizwe.org.za" },
                    { 17, 15, "United African Transformation", "https://www.uat.org.za" },
                    { 18, 17, "United Democratic Movement", "https://www.udm.org.za" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Parties",
                keyColumn: "Id",
                keyValue: 18);
        }
    }
}
