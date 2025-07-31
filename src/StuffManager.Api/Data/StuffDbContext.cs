using Microsoft.EntityFrameworkCore;

namespace StuffManager.Api.Data;

public class StuffDbContext : DbContext
{
    public StuffDbContext(DbContextOptions<StuffDbContext> options) : base(options)
    {
    }

    public DbSet<Stuff> Stuffs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Stuff>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
        });
    }
}
