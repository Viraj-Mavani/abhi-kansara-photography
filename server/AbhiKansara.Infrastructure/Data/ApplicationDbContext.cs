using AbhiKansara.Core.Entities;
using AbhiKansara.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AbhiKansara.Infrastructure.Data;

/// <summary>
/// Primary database context for the Abhi Kansara Photography platform.
/// Inherits from IdentityDbContext to get ASP.NET Identity tables (AspNetUsers, AspNetRoles, etc.)
/// and adds DbSets for all custom domain entities.
/// </summary>
public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // ── Services Domain ──
    public DbSet<Service> Services => Set<Service>();
    public DbSet<ServiceProcess> ServiceProcesses => Set<ServiceProcess>();
    public DbSet<ServiceTestimonial> ServiceTestimonials => Set<ServiceTestimonial>();
    public DbSet<ServiceFAQ> ServiceFAQs => Set<ServiceFAQ>();

    // ── Portfolio Domain ──
    public DbSet<ProjectGallery> ProjectGalleries => Set<ProjectGallery>();
    public DbSet<MediaItem> MediaItems => Set<MediaItem>();

    // ── Site Config ──
    public DbSet<SiteBio> SiteBios => Set<SiteBio>();
    public DbSet<PageConfig> PageConfigs => Set<PageConfig>();
    public DbSet<CarouselItem> CarouselItems => Set<CarouselItem>();

    // ── Client Vault ──
    public DbSet<ClientVault> ClientVaults => Set<ClientVault>();
    public DbSet<UserVaultAccess> UserVaultAccess => Set<UserVaultAccess>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); // MUST call base for Identity table configuration

        // Apply all IEntityTypeConfiguration<T> classes from this assembly
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // ────────────────────────────────────────────
        //  Service Domain Configurations
        // ────────────────────────────────────────────

        builder.Entity<Service>(entity =>
        {
            entity.HasIndex(s => s.Slug).IsUnique();
            entity.HasIndex(s => s.Order);

            // Store List<string> properties as JSONB in PostgreSQL
            entity.Property(s => s.Features).HasColumnType("jsonb");
            entity.Property(s => s.Highlights).HasColumnType("jsonb");
            entity.Property(s => s.GalleryImages).HasColumnType("jsonb");

            entity.HasMany(s => s.ProcessSteps)
                  .WithOne(p => p.Service)
                  .HasForeignKey(p => p.ServiceId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(s => s.Testimonials)
                  .WithOne(t => t.Service)
                  .HasForeignKey(t => t.ServiceId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(s => s.FAQs)
                  .WithOne(f => f.Service)
                  .HasForeignKey(f => f.ServiceId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ────────────────────────────────────────────
        //  Portfolio Domain Configurations
        // ────────────────────────────────────────────

        builder.Entity<ProjectGallery>(entity =>
        {
            entity.HasIndex(g => g.Slug).IsUnique();
            entity.HasIndex(g => g.Order);

            entity.HasMany(g => g.Media)
                  .WithOne(m => m.ProjectGallery)
                  .HasForeignKey(m => m.ProjectGalleryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<MediaItem>(entity =>
        {
            // Store enum as string in DB for readability
            entity.Property(m => m.Type)
                  .HasConversion<string>()
                  .HasMaxLength(10);
        });

        // ────────────────────────────────────────────
        //  Site Config
        // ────────────────────────────────────────────

        builder.Entity<PageConfig>(entity =>
        {
            entity.HasIndex(p => p.PageKey).IsUnique();
        });

        // ────────────────────────────────────────────
        //  Client Vault
        // ────────────────────────────────────────────

        builder.Entity<ClientVault>(entity =>
        {
            entity.HasMany(v => v.AuthorizedUsers)
                  .WithOne(a => a.ClientVault)
                  .HasForeignKey(a => a.ClientVaultId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserVaultAccess>(entity =>
        {
            // Composite unique constraint: one user can only have one access record per vault
            entity.HasIndex(u => new { u.UserId, u.ClientVaultId }).IsUnique();

            // FK to ApplicationUser
            entity.HasOne<ApplicationUser>()
                  .WithMany()
                  .HasForeignKey(u => u.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    /// <summary>
    /// Automatically sets UpdatedAt on SaveChanges for any modified BaseEntity.
    /// </summary>
    public override int SaveChanges()
    {
        SetAuditTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetAuditTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void SetAuditTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is Core.Common.BaseEntity &&
                        (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (Core.Common.BaseEntity)entry.Entity;
            entity.UpdatedAt = DateTime.UtcNow;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
        }
    }
}
