using cei.Models;
using Microsoft.EntityFrameworkCore;

namespace cei.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Vote> Votes { get; set; }
    public DbSet<Party> Parties { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
    }
    
}