using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AbhiKansara.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroBackgrounds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HeroInterval",
                table: "PageConfigs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "HeroBackgrounds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    AltText = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeroBackgrounds", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "HeroBackgrounds",
                columns: new[] { "Id", "AltText", "CreatedAt", "ImageUrl", "Order", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("03afa131-db6d-4f80-b184-8e330d5bd330"), null, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3823), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg3.webp", 3, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3823) },
                    { new Guid("46dd6233-0615-48a2-b11f-e59f137b3300"), null, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3835), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg7.webp", 7, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3835) },
                    { new Guid("6eaf147b-ccf3-42ba-b75c-34b4711d739a"), null, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3825), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg4.webp", 4, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3826) },
                    { new Guid("80729096-ce94-4e5d-97f4-f3a47fa2f94e"), null, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3805), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg1.webp", 0, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3805) },
                    { new Guid("90eeca4a-4335-4fc9-856b-7c8efffb576b"), null, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3812), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg2.webp", 2, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3812) },
                    { new Guid("d8d848c9-241c-4e52-aa9e-daf019c7462b"), null, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3809), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg0.webp", 1, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3809) },
                    { new Guid("d9292c5d-d7b7-4418-86f1-a9dc1198b6de"), null, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3827), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg5.webp", 5, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3828) },
                    { new Guid("fb5e5345-bb1e-4a6e-99d3-d33afdcc483b"), null, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3830), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg6.webp", 6, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3830) }
                });

            migrationBuilder.InsertData(
                table: "PageConfigs",
                columns: new[] { "Id", "CreatedAt", "CtaLink", "CtaText", "HeroInterval", "HeroSubtitle", "HeroTagline", "HeroTitle", "PageKey", "UpdatedAt" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3573), null, null, 4, "Capturing the essence of your most precious moments with a cinematic and timeless touch.", "STORYTELLER", "ABHI KANSARA", "home", new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3577) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HeroBackgrounds");

            migrationBuilder.DeleteData(
                table: "PageConfigs",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DropColumn(
                name: "HeroInterval",
                table: "PageConfigs");
        }
    }
}
