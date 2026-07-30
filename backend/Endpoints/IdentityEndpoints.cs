using backend.Data;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Endpoints;

public static class IdentityEndpoints
{
    public static void MapIdentityApiEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth").RequireAuthorization();
        
        group.MapPost("/register", Register).AllowAnonymous();
        group.MapPost("/login", Login).AllowAnonymous();
        group.MapPost("/logout", Logout);
        return;
        
        static async Task<IResult> Register(UserManager<ApplicationUser> userManager, [FromBody] RegisterDto dto, ILogger<ApplicationUser> logger)
        {
            var user = new ApplicationUser
            {
                UserName = dto.UserName ?? dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IdentityNumber = dto.IdentityNumber,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = dto.Password,
            };
            
            var results = await userManager.CreateAsync(user, dto.Password);
            
            if (!results.Succeeded)
            {
                logger.LogError("Failed to create user.");
                Console.WriteLine(results.Errors);
                return TypedResults.BadRequest(results.Errors);
            }

            logger.LogInformation("User created successfully.");
            return TypedResults.Created($"/api/auth/{user.Id}", new { id = user.Id, user.Email });
        }
        
        static async Task<IResult> Login(SignInManager<ApplicationUser> signInManager, [FromBody] LoginDto dto, ILogger<ApplicationUser> logger)
        {
            var result = await signInManager.PasswordSignInAsync(dto.UserName, dto.Password, false, false);

            if (!result.Succeeded)
            {
                logger.LogError($"Invalid login attempt with the username \"{dto.UserName}\" & password \"{dto.Password}\"");
                return TypedResults.Unauthorized();
            }
            
            logger.LogInformation($"User {dto.UserName} successfully logged in.");
            return TypedResults.Ok();
        }
        
        static async Task<IResult> Logout(SignInManager<ApplicationUser> signInManager, ILogger<ApplicationUser> logger)
        {
            await signInManager.SignOutAsync();
            logger.LogInformation("User successfully logged out.");
            return TypedResults.Ok();
        }
    }
}