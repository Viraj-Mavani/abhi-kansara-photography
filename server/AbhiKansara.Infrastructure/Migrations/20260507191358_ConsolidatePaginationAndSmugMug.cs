using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AbhiKansara.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConsolidatePaginationAndSmugMug : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("0a445c93-6bdb-4764-b31b-c61bb9d7d2df"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("6c87d01e-ebf5-458d-8a47-56f11af6e792"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("6e87e854-aa50-44d8-b594-90eee2cc3703"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("892849de-f7d2-4a4e-9e03-73e2824338f9"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("8f2c185d-e187-415e-ac5c-7aa78919a23e"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("95bffccb-c268-4d41-8843-f24b4b80f915"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("9f925dda-0c36-49af-b876-86c1d7d7bb46"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("e0fe3849-2966-4824-a666-9c6acdec7602"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastSmugMugSync",
                table: "ProjectGalleries",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SmugMugAlbumId",
                table: "ProjectGalleries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SmugMugAlbumKey",
                table: "ProjectGalleries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "CarouselItems",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                table: "HeroBackgrounds",
                columns: new[] { "Id", "AltText", "CreatedAt", "ImageUrl", "Order", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("b1111111-1111-1111-1111-111111111111"), null, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4602), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg1.webp", 0, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4603) },
                    { new Guid("b2222222-2222-2222-2222-222222222222"), null, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4607), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg0.webp", 1, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4607) },
                    { new Guid("b3333333-3333-3333-3333-333333333333"), null, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4657), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg2.webp", 2, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4658) },
                    { new Guid("b4444444-4444-4444-4444-444444444444"), null, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4672), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg3.webp", 3, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4673) },
                    { new Guid("b5555555-5555-5555-5555-555555555555"), null, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4675), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg4.webp", 4, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4676) },
                    { new Guid("b6666666-6666-6666-6666-666666666666"), null, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4679), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg5.webp", 5, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4680) },
                    { new Guid("b7777777-7777-7777-7777-777777777777"), null, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4681), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg6.webp", 6, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4682) },
                    { new Guid("b8888888-8888-8888-8888-888888888888"), null, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4684), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg7.webp", 7, new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4684) }
                });

            migrationBuilder.UpdateData(
                table: "PageConfigs",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4368), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4373) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b1111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b2222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b3333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b4444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b5555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b6666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b7777777-7777-7777-7777-777777777777"));

            migrationBuilder.DeleteData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b8888888-8888-8888-8888-888888888888"));

            migrationBuilder.DropColumn(
                name: "LastSmugMugSync",
                table: "ProjectGalleries");

            migrationBuilder.DropColumn(
                name: "SmugMugAlbumId",
                table: "ProjectGalleries");

            migrationBuilder.DropColumn(
                name: "SmugMugAlbumKey",
                table: "ProjectGalleries");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "CarouselItems");

            migrationBuilder.InsertData(
                table: "HeroBackgrounds",
                columns: new[] { "Id", "AltText", "CreatedAt", "ImageUrl", "Order", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("0a445c93-6bdb-4764-b31b-c61bb9d7d2df"), null, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4435), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg5.webp", 5, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4435) },
                    { new Guid("6c87d01e-ebf5-458d-8a47-56f11af6e792"), null, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4417), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg2.webp", 2, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4417) },
                    { new Guid("6e87e854-aa50-44d8-b594-90eee2cc3703"), null, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4437), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg6.webp", 6, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4437) },
                    { new Guid("892849de-f7d2-4a4e-9e03-73e2824338f9"), null, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4441), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg7.webp", 7, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4442) },
                    { new Guid("8f2c185d-e187-415e-ac5c-7aa78919a23e"), null, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4414), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg0.webp", 1, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4415) },
                    { new Guid("95bffccb-c268-4d41-8843-f24b4b80f915"), null, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4411), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg1.webp", 0, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4412) },
                    { new Guid("9f925dda-0c36-49af-b876-86c1d7d7bb46"), null, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4430), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg3.webp", 3, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4430) },
                    { new Guid("e0fe3849-2966-4824-a666-9c6acdec7602"), null, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4433), "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev/images/bg/bg4.webp", 4, new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4433) }
                });

            migrationBuilder.UpdateData(
                table: "PageConfigs",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4215), new DateTime(2026, 5, 7, 19, 5, 29, 651, DateTimeKind.Utc).AddTicks(4223) });
        }
    }
}
