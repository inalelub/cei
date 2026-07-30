using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options) 
{
    public DbSet<Vote> Votes { get; set; }
    public DbSet<Party> Parties { get; set; }
    public DbSet<Address> Addresses { get; set; }

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
            b.Property(u => u.PhoneNumber).HasMaxLength(10).IsRequired();
            b.Property(u => u.IdentityNumber).HasMaxLength(13).IsRequired();
            b.Property(u => u.FirstName).HasMaxLength(128).IsRequired();
            b.Property(u => u.LastName).HasMaxLength(128).IsRequired();
        });

        modelBuilder.Entity<Address>(b =>
        {
            b.Property(a => a.Street).HasMaxLength(128).IsRequired();
            b.Property(a => a.Suburb).HasMaxLength(128).IsRequired();
            b.Property(a => a.City).HasMaxLength(128).IsRequired();
            b.Property(a => a.Province).IsRequired();
            b.Property(a => a.ZipCode).HasMaxLength(4).IsRequired();
        });

        modelBuilder.Entity<Party>(entity =>
        {
            entity.Property(p => p.PartyName).HasMaxLength(128).IsRequired().HasColumnOrder(1);
            entity.Property(p => p.PartyAbbreviation).HasMaxLength(50).IsRequired().HasColumnOrder(2);
            entity.Property(p => p.PartyUrl).HasColumnOrder(3);
            entity.Property(p => p.LogoUrl).HasColumnOrder(4);
        });

        // Relationships 
        modelBuilder.Entity<ApplicationUser>().HasOne(v => v.Vote).WithOne(a => a.ApplicationUser).HasForeignKey<Vote>(v => v.ApplicationUserId).IsRequired(false);
        modelBuilder.Entity<ApplicationUser>().HasOne(v => v.Address).WithOne(a => a.ApplicationUser).HasForeignKey<Address>(v => v.ApplicationUserId).IsRequired(false);
        modelBuilder.Entity<Party>().HasMany(v => v.Votes).WithOne(a => a.Party).HasForeignKey(a => a.PartyId).IsRequired(false);

        // Seed the parties data
        DatabaseSeeder.SeedParties(modelBuilder);
    }

}