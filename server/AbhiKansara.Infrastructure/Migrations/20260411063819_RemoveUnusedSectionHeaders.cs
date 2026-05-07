using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AbhiKansara.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnusedSectionHeaders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SectionSubtitle1",
                table: "PageConfigs");

            migrationBuilder.DropColumn(
                name: "SectionSubtitle2",
                table: "PageConfigs");

            migrationBuilder.DropColumn(
                name: "SectionTitle1",
                table: "PageConfigs");

            migrationBuilder.DropColumn(
                name: "SectionTitle2",
                table: "PageConfigs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SectionSubtitle1",
                table: "PageConfigs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SectionSubtitle2",
                table: "PageConfigs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SectionTitle1",
                table: "PageConfigs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SectionTitle2",
                table: "PageConfigs",
                type: "text",
                nullable: true);
        }
    }
}
