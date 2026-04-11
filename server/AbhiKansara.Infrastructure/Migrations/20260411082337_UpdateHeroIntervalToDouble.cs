using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AbhiKansara.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHeroIntervalToDouble : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("03afa131-db6d-4f80-b184-8e330d5bd330"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("46dd6233-0615-48a2-b11f-e59f137b3300"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("6eaf147b-ccf3-42ba-b75c-34b4711d739a"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("80729096-ce94-4e5d-97f4-f3a47fa2f94e"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("90eeca4a-4335-4fc9-856b-7c8efffb576b"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("d8d848c9-241c-4e52-aa9e-daf019c7462b"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("d9292c5d-d7b7-4418-86f1-a9dc1198b6de"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("fb5e5345-bb1e-4a6e-99d3-d33afdcc483b"));

            migrationBuilder.AlterColumn<double>(
                name: "HeroInterval",
                table: "PageConfigs",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.InsertData(
                table: "HeroBackgrounds",
                columns: new[] { "Id", "AltText", "CreatedAt", "ImageUrl", "Order", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("380713d6-3d09-423e-9a21-74ab4e62c5ea"), null, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7288), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg3.webp", 3, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7289) },
                    { new Guid("55bb7db1-05b9-4631-8dee-c3ba9d8d09b0"), null, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7283), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg0.webp", 1, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7283) },
                    { new Guid("8a9365d8-8862-492f-be77-3f619e6d7898"), null, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7297), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg5.webp", 5, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7297) },
                    { new Guid("b1de7a47-f69a-419f-b87f-3345e82dc771"), null, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7263), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg1.webp", 0, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7264) },
                    { new Guid("c7ccc139-6d00-431a-9c7f-2b269cc5eefd"), null, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7286), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg2.webp", 2, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7286) },
                    { new Guid("d2169c97-9d04-4db9-b510-0f851fad71d1"), null, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7302), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg7.webp", 7, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7302) },
                    { new Guid("e608a2b6-4545-459b-86f5-1742f66a1473"), null, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7292), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg4.webp", 4, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7292) },
                    { new Guid("f2e21509-7ce2-478e-af72-0217352d19e4"), null, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7299), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg6.webp", 6, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7300) }
                });

            migrationBuilder.UpdateData(
                table: "PageConfigs",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "HeroInterval", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7033), 4.5, new DateTime(2026, 4, 11, 8, 23, 36, 558, DateTimeKind.Utc).AddTicks(7035) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("380713d6-3d09-423e-9a21-74ab4e62c5ea"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("55bb7db1-05b9-4631-8dee-c3ba9d8d09b0"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("8a9365d8-8862-492f-be77-3f619e6d7898"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b1de7a47-f69a-419f-b87f-3345e82dc771"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("c7ccc139-6d00-431a-9c7f-2b269cc5eefd"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("d2169c97-9d04-4db9-b510-0f851fad71d1"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("e608a2b6-4545-459b-86f5-1742f66a1473"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("f2e21509-7ce2-478e-af72-0217352d19e4"));

            migrationBuilder.AlterColumn<int>(
                name: "HeroInterval",
                table: "PageConfigs",
                type: "integer",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

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

            migrationBuilder.UpdateData(
                table: "PageConfigs",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "HeroInterval", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3573), 4, new DateTime(2026, 4, 11, 7, 51, 14, 975, DateTimeKind.Utc).AddTicks(3577) });
        }
    }
}
