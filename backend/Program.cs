using backend.Data;
using backend.Services;
using backend.Endpoints;
using Scalar.AspNetCore;
using cei.ServiceDefaults;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.AddServiceDefaults();
builder.Services.AddOpenApi();
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy => policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>())
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()));
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration["ConnectionStrings:DefaultConnection"])); 
// Register the core identity services into the DI container (usermanager, siginmanager, etc.)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();
builder.Services.AddTransient<IEmailSender, EmailSender>();

builder.Services.Configure<IdentityOptions>((options =>
{
   options.User.RequireUniqueEmail = true; 
   options.SignIn.RequireConfirmedEmail = true;
}));

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
});

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();

// Dev only: bring the database schema up to date with the latest EF Core migrations on startup.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Integration tests swap in the in-memory provider, which has no migrations (they call EnsureCreated instead).
    if (db.Database.IsRelational()) db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); 
}

app.MapDefaultEndpoints();

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

app.MapIdentityApiEndpoints();
app.MapVotingEndpoints();

app.Run();