using API.Extensions;
using API.Middleware;
using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Persistence;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);
 
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CorsPolicy");
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
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
