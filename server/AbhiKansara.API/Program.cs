using System.Text;
using System.Text.Json.Serialization;
using AbhiKansara.Infrastructure.Data;
using AbhiKansara.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ── Database (PostgreSQL via Npgsql) ──
// Npgsql 8.x requires EnableDynamicJson() for JSONB serialization of CLR types (List<string>)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
var dataSourceBuilder = new Npgsql.NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        dataSource,
        npgsqlOptions => npgsqlOptions.MigrationsAssembly("AbhiKansara.Infrastructure")
    ));

// ── ASP.NET Identity ──
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    // Password settings (relaxed for dev, tighten for production)
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;

    // User settings
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// ── JWT Authentication ──
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JwtSettings:SecretKey is missing");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // Set to true in production
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// ── Controllers with JSON cycle handling ──
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Prevent circular reference errors when returning EF Core entities with navigation properties
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

        // Use camelCase to match the frontend's JavaScript conventions
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;

        // Serialize enums as strings (e.g., "photo" instead of "Photo")
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase));
    });

// ── Swagger / OpenAPI ──
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AbhiKansara API", Version = "v1" });

    // Enable JWT authorization in Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// ── CORS (allow Next.js frontend in development) ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ── Seed Database ──
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    
    try
    {
        await DataSeeder.SeedAsync(context, logger);
        await IdentitySeeder.SeedAsync(userManager, roleManager, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// ── Middleware Pipeline ──
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ── Health check endpoint ──
app.MapGet("/api/health", () => Results.Ok(new
{
    Status = "Healthy",
    Timestamp = DateTime.UtcNow,
    Service = "AbhiKansara.API"
}))
.WithName("HealthCheck")
.WithOpenApi();

app.Run();
