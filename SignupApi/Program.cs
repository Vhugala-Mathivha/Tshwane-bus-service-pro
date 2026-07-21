using Microsoft.EntityFrameworkCore;
using SignupApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Signup Database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        "Server=localhost;Port=3306;Database=signupdb;User=root;Password=;",
        ServerVersion.AutoDetect("Server=localhost;Port=3306;Database=signupdb;User=root;Password=;"));
});

// Tshwane Database
builder.Services.AddDbContext<TshwaneDbContext>(options =>
{
    options.UseMySql(
        "Server=localhost;Port=3306;Database=tshwane_db;User=root;Password=;",
        ServerVersion.AutoDetect("Server=localhost;Port=3306;Database=tshwane_db;User=root;Password=;"));
});

var app = builder.Build();

// Configure HTTP pipeline
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();

app.Run();