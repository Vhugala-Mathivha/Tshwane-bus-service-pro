using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------
// 1. Service Registrations
// ---------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();
builder.Services.AddScoped<OtpService>();
builder.Services.AddScoped<EmailServices>();

// Database Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "server=localhost;port=3306;database=tshwane_bus_db;user=root;password=";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// CORS Configuration
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// ---------------------------------------------------------
// 2. HTTP Request Pipeline & Initialization
// ---------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.EnsureCreated();
        Console.WriteLine("Database connection successful!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection error: {ex.Message}");
        Console.WriteLine("Please ensure MySQL is running and the connection string is correct.");
    }
}

app.UseCors("AllowReact");

// ---------------------------------------------------------
// 3. Map Endpoints & Controllers
// ---------------------------------------------------------

// Hardcoded Tshwane stations list
var tshwaneStations = new List<BusStation>
{
    // new(1, "Booysens", -25.7194, 28.1456),
    new(2, "Wonderboom Pick Up Point", -25.744724401017038, 28.185399601931213),
    new(3, "Brooklyn Pick Up Point", -25.75055584885475, 28.18155360474062),
    new(4, "Lynwood Ridge Pick Up Point", -25.744856378182497, 28.18848673593704),
    new(5, "East Lynne Pick Up Point", -25.744193546646216, 28.19851003997434),
    new(6, "Centurion Pick Up Point", -25.74789340046251, 28.189374884690416),
    new(7, "Silverton Pick Up Point", -25.746469725548565, 28.19550384782082)
};

// Map API Endpoint
app.MapGet("/api/map/stations", () => Results.Ok(tshwaneStations));

app.MapControllers();

app.Run();

// ---------------------------------------------------------
// 4. Data Models
// ---------------------------------------------------------
public record BusStation(int Id, string Name, double Lat, double Lng);