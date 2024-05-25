using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Persistence;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);
 
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(opt =>
{
        // opt.UseSqlite("Data Source=reactivities.db");
        opt.UseNpgsql("Server=product.database;Port=5432;User Id=postgres;Password=postgresql;Database=reactivities.db");
});
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
    });
});
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(List.Handler).Assembly));
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly); //this will look into assembly(project) and find Mapping profile to use AutoMapper type of mapping class

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CorsPolicy");
//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//Create database using migration 
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    context.Database.Migrate();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}


app.Run();
