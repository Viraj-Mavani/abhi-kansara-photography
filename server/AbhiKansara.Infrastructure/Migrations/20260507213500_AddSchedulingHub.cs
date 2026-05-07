using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AbhiKansara.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSchedulingHub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Link",
                table: "CarouselItems");

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientName = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true),
                    StartDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EventType = table.Column<string>(type: "text", nullable: true),
                    IsFullDay = table.Column<bool>(type: "boolean", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    AmountProposed = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    PaymentReceived = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b1111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9392), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9393) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b2222222-2222-2222-2222-222222222222"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9398), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9398) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b3333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9402), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9402) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b4444444-4444-4444-4444-444444444444"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9405), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9405) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b5555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9407), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9407) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b6666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9410), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9410) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b7777777-7777-7777-7777-777777777777"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9412), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9412) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b8888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9415), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9415) });

            migrationBuilder.UpdateData(
                table: "PageConfigs",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9153), new DateTime(2026, 5, 7, 21, 34, 59, 688, DateTimeKind.Utc).AddTicks(9156) });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_StartDateTime",
                table: "Bookings",
                column: "StartDateTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "CarouselItems",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b1111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4602), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4603) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b2222222-2222-2222-2222-222222222222"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4607), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4607) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b3333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4657), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4658) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b4444444-4444-4444-4444-444444444444"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4672), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4673) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b5555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4675), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4676) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b6666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4679), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4680) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b7777777-7777-7777-7777-777777777777"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4681), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4682) });

            migrationBuilder.UpdateData(
                table: "HeroBackgrounds",
                keyColumn: "Id",
                keyValue: new Guid("b8888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4684), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4684) });

            migrationBuilder.UpdateData(
                table: "PageConfigs",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4368), new DateTime(2026, 5, 7, 19, 13, 57, 741, DateTimeKind.Utc).AddTicks(4373) });
        }
    }
}
