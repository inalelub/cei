using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using vote.Models;

namespace vote.Data;

public class ApplicationDbContext :IdentityDbContext<ApplicationUser> 
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }
    
    // public DbSet<User> Users { get; set; }
    // public DbSet<Vote> Votes { get; set; }
    // public DbSet<Party> Parties { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        base.OnModelCreating(modelBuilder);
        
        // This is the changing of the default table names that identity scaffolds
        modelBuilder.Entity<ApplicationUser>(b => b.ToTable("Users"));
        modelBuilder.Entity<IdentityUserClaim<string>>(b => b.ToTable("UserClaims"));
        modelBuilder.Entity<IdentityUserLogin<string>>(b => b.ToTable("UserLogins"));
        modelBuilder.Entity<IdentityUserToken<string>>(b => b.ToTable("UserTokens"));
        modelBuilder.Entity<IdentityRole>(b => b.ToTable("Role"));
        modelBuilder.Entity<IdentityRoleClaim<string>>(b => b.ToTable("RoleClaims"));
        modelBuilder.Entity<IdentityUserRole<string>>(b => b.ToTable("UserRoles"));
        
        // Configuring some data columns with some certain facets
        modelBuilder.Entity<ApplicationUser>(b =>
        {
            b.Property(u => u.Id).HasColumnOrder(0);
            b.Property(u => u.UserName).HasMaxLength(128);
            b.Property(u => u.NormalizedUserName).HasMaxLength(128);
            b.Property(u => u.Email).HasMaxLength(128);
            b.Property(u => u.NormalizedEmail).HasMaxLength(128);
            b.Property(u => u.PhoneNumber).HasMaxLength(10).IsRequired().HasColumnOrder(4);
        });
        
    }
    
}