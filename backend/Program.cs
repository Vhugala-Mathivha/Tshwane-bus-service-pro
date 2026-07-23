using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Basic Swagger setup

// Register application services
builder.Services.AddMemoryCache();
builder.Services.AddScoped<OtpService>();
builder.Services.AddScoped<EmailServices>();

// DB Connection - Read from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "server=localhost;port=3306;database=tshwane_bus_db;user=root;password=";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // This uses the default /swagger route
}

// Ensure database is created and apply any pending migrations
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
app.MapControllers();
app.Run();
