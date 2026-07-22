using Microsoft.EntityFrameworkCore;
using backend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Basic Swagger setup

// DB Connection - PUT YOUR MYSQL PASSWORD HERE
var connectionString = "server=localhost;port=3306;database=tshwane_bus_db;user=root;password=";
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

app.UseCors("AllowReact");
app.MapControllers();
app.Run();