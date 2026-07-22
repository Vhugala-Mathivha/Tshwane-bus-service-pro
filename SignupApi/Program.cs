using Microsoft.EntityFrameworkCore;
using SignupApi.data; // Lowercase 'data'
using SignupApi.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers & OpenAPI/Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Configure MySQL Database Connection for tshwane_bus_db
var connectionString = "Server=localhost;Port=3306;Database=tshwane_bus_db;User=root;Password=;";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    );
});

// 3. Register Application Services for Dependency Injection (Fixes AuthController errors)
builder.Services.AddScoped<OtpService>();
builder.Services.AddScoped<EmailServices>(); // Matches EmailServices in AuthController constructor

var app = builder.Build();

// 4. Configure HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();