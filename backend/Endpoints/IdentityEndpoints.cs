﻿﻿﻿﻿using System.Security.Claims;
using backend.Data;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
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
        group.MapGet("/confirm-email", ConfirmEmail).AllowAnonymous();
        group.MapPost("/resend-confirmation", ResendConfirmation).AllowAnonymous();
        group.MapPost("/forgot-password", ForgotPassword).AllowAnonymous();
        group.MapGet("/reset-password", ResetPassword).AllowAnonymous();
        group.MapGet("/me", GetUser);
        return;

        static async Task<IResult> Register(UserManager<ApplicationUser> userManager, IEmailSender emailSender, [FromBody] RegisterDto dto, ILogger<ApplicationUser> logger)
        {
            var user = new ApplicationUser
            {
                UserName = dto.UserName ?? dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IdentityNumber = dto.IdentityNumber,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                logger.LogError("Failed to create user.");
                return TypedResults.BadRequest(result.Errors);
            }

            // TODO: In production use an absolute URL for the confirmation link, e.g., https://yourdomain.com/api/auth/confirm-email
            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var link = $"http://localhost:5102/api/auth/confirm-email?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(token)}";
            var message = $"Please confirm your email: {link}";

            await emailSender.SendEmailAsync(user.Email, subject: "Confirm your email", htmlMessage: message);

            logger.LogInformation("User created successfully.");
            return TypedResults.Created($"/api/auth/{user.Id}", new { userId = user.Id, user.Email });
        }

        static async Task<IResult> Login(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, [FromBody] LoginDto dto, ILogger<ApplicationUser> logger)
        {
            var result = await signInManager.PasswordSignInAsync(dto.UserName, dto.Password, false, false);

            if (result.IsNotAllowed)
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user is { EmailConfirmed: false })
                {
                    logger.LogWarning("Sign-in denied for user {UserName}: email address is not confirmed.", dto.UserName);
                    return TypedResults.Problem(
                        statusCode: StatusCodes.Status403Forbidden,
                        title: "Email confirmation required",
                        detail: "Confirm your email address before signing in.");
                }

                logger.LogWarning("Sign-in denied for user {UserName}: account is not allowed to sign in.", dto.UserName);
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status403Forbidden,
                    title: "Sign-in not allowed");
            }

            if (!result.Succeeded)
            {
                logger.LogWarning("Sign-in failed for user {UserName}: invalid credentials.", dto.UserName);
                return TypedResults.Unauthorized();
            }

            logger.LogInformation("User {UserName} signed in successfully.", dto.UserName);
            return TypedResults.Ok(new { message = "Login successful." });
        }

        static async Task<IResult> Logout(SignInManager<ApplicationUser> signInManager, ClaimsPrincipal userPrincipal, ILogger<ApplicationUser> logger)
        {
            await signInManager.SignOutAsync();
            logger.LogInformation("User {UserName} logged out successfully.", userPrincipal.Identity?.Name);
            return TypedResults.Ok(new { message = "Logged out successfully." });
        }

        static async Task<IResult> ConfirmEmail(UserManager<ApplicationUser> userManager, [FromQuery] string email, [FromQuery] string token, ILogger<ApplicationUser> logger)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                logger.LogWarning("Email confirmation requested for an unknown email address.");
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    title: "User not found",
                    detail: "No account exists for the provided email address.");
            }

            var result = await userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
            {
                logger.LogWarning("Email confirmation failed for user {UserId}. Errors: {Errors}", user.Id, string.Join(", ", result.Errors.Select(error => error.Code)));
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Email confirmation failed",
                    detail: string.Join(" ", result.Errors.Select(error => error.Description)));
            }

            logger.LogInformation("Email confirmed successfully for user {UserId}.", user.Id);
            return TypedResults.Ok(new { message = "Email confirmed successfully." });
        }

        static async Task<IResult> ResendConfirmation(UserManager<ApplicationUser> userManager, IEmailSender emailSender, [FromBody] ResendConfirmationDto dto, ILogger<ApplicationUser> logger)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                logger.LogWarning("Email confirmation requested for an unknown email address.");
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    title: "User not found",
                    detail: "No account exists for the provided email address.");
            }

            // TODO: In production use an absolute URL for the confirmation link, e.g., https://yourdomain.com/api/auth/confirm-email
            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var link = $"http://localhost:5102/api/auth/confirm-email?email={Uri.EscapeDataString(user.Email!)}&token={Uri.EscapeDataString(token)}";
            var message = $"Please confirm your email: {link}";

            await emailSender.SendEmailAsync(user.Email!, subject: "Confirm your email", htmlMessage: message);

            logger.LogInformation("Confirmation email resent to user {UserId}.", user.Id);
            return TypedResults.Ok(new { message = "Confirmation email resent." });
        }

        static async Task<IResult> ForgotPassword(UserManager<ApplicationUser> userManager, IEmailSender emailSender, [FromBody] ForgotPasswordDto dto, ILogger<ApplicationUser> logger)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                logger.LogWarning("Password reset requested for an unknown email address.");
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    title: "User not found",
                    detail: "No account exists for the provided email address.");
            }

            // TODO: In production use an absolute URL for the reset link, e.g., https://yourdomain.com/api/auth/reset-password
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var link = $"http://localhost:5102/api/auth/reset-password?email={Uri.EscapeDataString(user.Email!)}&token={Uri.EscapeDataString(token)}";
            var message = $"Can you please click the following link to reset your password: {link}";

            await emailSender.SendEmailAsync(user.Email!, subject: "Reset your password", htmlMessage: message);
            logger.LogInformation("Password reset email sent to user {UserId}.", user.Id);

            return TypedResults.Ok(new { message = "Password reset email sent." });
        }

        static async Task<IResult> ResetPassword(UserManager<ApplicationUser> userManager, ILogger<ApplicationUser> logger, [FromBody] ResetPasswordDto dto, [FromQuery] string email, [FromQuery] string token)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                logger.LogWarning("Password reset requested for an unknown email address.");
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    title: "User not found",
                    detail: "No account exists for the provided email address.");
            }

            var result = await userManager.ResetPasswordAsync(user, token, dto.NewPassword);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to reset password for user {UserId}. Errors: {Errors}", user.Id, string.Join(", ", result.Errors.Select(error => error.Code)));
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Password reset failed",
                    detail: string.Join(" ", result.Errors.Select(error => error.Description)));
            }

            logger.LogInformation("Password for user {UserId} reset successfully.", user.Id);

            return TypedResults.Ok(new { message = "Password reset successfully." });
        }

        static async Task<IResult> GetUser(UserManager<ApplicationUser> userManager, ClaimsPrincipal userPrincipal, ILogger<ApplicationUser> logger)
        {
            var user = await userManager.GetUserAsync(userPrincipal);
            if (user == null)
            {
                logger.LogWarning(
                    "Unable to retrieve authenticated user with subject {UserId}.",
                    userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier));

                return TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    title: "User not found",
                    detail: "The authenticated user account could not be found.");
            }

            logger.LogInformation("Retrieved profile for user {UserId} successfully.", user.Id);
            return TypedResults.Ok(new { identityNumber = user.IdentityNumber, email = user.Email, firstName = user.FirstName, lastName = user.LastName, address = user.Address });
        }
    }
}
