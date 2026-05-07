using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AbhiKansara.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveServiceComplexity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceAddOns");

            migrationBuilder.DropTable(
                name: "ServiceDeliverables");

            migrationBuilder.DropTable(
                name: "ServicePackages");

            migrationBuilder.DropColumn(
                name: "IndoorOutdoor",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "MaxCapacity",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "MinDuration",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "PriceNote",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "StartingPrice",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "TravelAvailable",
                table: "Services");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IndoorOutdoor",
                table: "Services",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaxCapacity",
                table: "Services",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MinDuration",
                table: "Services",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PriceNote",
                table: "Services",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StartingPrice",
                table: "Services",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Tags",
                table: "Services",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<bool>(
                name: "TravelAvailable",
                table: "Services",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ServiceAddOns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceAddOns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceAddOns_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ServicePackages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Duration = table.Column<string>(type: "text", nullable: true),
                    IsPopular = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<string>(type: "text", nullable: true),
                    PriceNote = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicePackages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServicePackages_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ServiceDeliverables",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServicePackageId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Detail = table.Column<string>(type: "text", nullable: true),
                    Item = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceDeliverables", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceDeliverables_ServicePackages_ServicePackageId",
                        column: x => x.ServicePackageId,
                        principalTable: "ServicePackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceAddOns_ServiceId",
                table: "ServiceAddOns",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceDeliverables_ServicePackageId",
                table: "ServiceDeliverables",
                column: "ServicePackageId");

            migrationBuilder.CreateIndex(
                name: "IX_ServicePackages_ServiceId",
                table: "ServicePackages",
                column: "ServiceId");
        }
    }
}
