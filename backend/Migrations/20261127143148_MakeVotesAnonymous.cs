using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class MakeVotesAnonymous : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Votes_Users_ApplicationUserId",
                table: "Votes");

            migrationBuilder.DropIndex(
                name: "IX_Votes_ApplicationUserId",
                table: "Votes");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Votes");

            // Votes cast before this migration have exact timestamps; round them down to the hour like new ones.
            // A datetime2 base (not 0, which is a 1900 datetime) also handles rows AddVoteCastAt defaulted to 0001-01-01.
            migrationBuilder.Sql(
                "DECLARE @base datetime2 = '0001-01-01';" +
                "UPDATE [Votes] SET [CastAt] = DATEADD(hour, DATEDIFF(hour, @base, [CastAt]), @base);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Votes",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Votes_ApplicationUserId",
                table: "Votes",
                column: "ApplicationUserId",
                unique: true,
                filter: "[ApplicationUserId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Votes_Users_ApplicationUserId",
                table: "Votes",
                column: "ApplicationUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
