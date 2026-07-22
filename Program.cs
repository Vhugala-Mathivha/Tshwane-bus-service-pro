using Microsoft.EntityFrameworkCore;
using TshwaneBusApi.Data;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Read the MySQL connection string from appsettings.json ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found in appsettings.json.");

// --- 2. Register the DbContext so it can be injected into controllers ---
// ServerVersion.AutoDetect connects once at startup to figure out your MySQL version.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// --- 3. Register MVC controllers (this is what makes [ApiController] classes work) ---
builder.Services.AddControllers();

// --- 4. Swagger: gives you an interactive /swagger UI to test endpoints, like Postman built in ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 5. CORS: by default browsers block http://localhost:5173 (Vite) from calling
// http://localhost:5000 (this API) because they're different origins/ports.
// This policy explicitly allows the Vite dev server through.
const string ViteDevCorsPolicy = "ViteDevCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(ViteDevCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(ViteDevCorsPolicy); // must come before MapControllers
app.UseAuthorization();
app.MapControllers();

app.Run();
