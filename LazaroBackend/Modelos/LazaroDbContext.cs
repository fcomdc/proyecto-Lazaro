using Microsoft.EntityFrameworkCore;

namespace LazaroBackend.Models
{
    public class LazaroDbContext : DbContext
    {
        public LazaroDbContext(DbContextOptions<LazaroDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Paciente> Pacientes { get; set; } = null!;
        public DbSet<Especialidad> Especialidades { get; set; } = null!;
        public DbSet<Medico> Medicos { get; set; } = null!;
        public DbSet<Sintoma> Sintomas { get; set; } = null!;
        public DbSet<Evaluacion> Evaluaciones { get; set; } = null!;
        public DbSet<EvaluacionSintoma> EvaluacionSintomas { get; set; } = null!;
        public DbSet<Triaje> Triajes { get; set; } = null!;
        public DbSet<Cita> Citas { get; set; } = null!;
        public DbSet<Emergencia> Emergencias { get; set; } = null!;
        public DbSet<Sala> Salas { get; set; } = null!;
        public DbSet<Ingreso> Ingresos { get; set; } = null!;
        public DbSet<MovimientoPaciente> MovimientosPaciente { get; set; } = null!;
        public DbSet<Tratamiento> Tratamientos { get; set; } = null!;
        public DbSet<Traslado> Traslados { get; set; } = null!;
        public DbSet<HistorialClinico> HistorialClinico { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configuraciones de unicidad (Unique constraints)
            modelBuilder.Entity<Usuario>().HasIndex(u => u.NombreUsuario).IsUnique();
            modelBuilder.Entity<Paciente>().HasIndex(p => p.NumeroExpediente).IsUnique();
            modelBuilder.Entity<Especialidad>().HasIndex(e => e.Nombre).IsUnique();
            modelBuilder.Entity<Medico>().HasIndex(m => m.NumeroLicencia).IsUnique();
            
            modelBuilder.Entity<Sintoma>().HasIndex(s => s.Nombre).IsUnique();
            modelBuilder.Entity<Sala>().HasIndex(s => s.Nombre).IsUnique();
            modelBuilder.Entity<Triaje>().HasIndex(t => t.IdEvaluacion).IsUnique();

            // Llaves primarias compuestas
            modelBuilder.Entity<EvaluacionSintoma>()
                .HasKey(es => new { es.IdEvaluacion, es.IdSintoma });

            // Configuraciones de Foreign Keys (evitando problemas de borrado en cascada de SQL Server)
            
            modelBuilder.Entity<EvaluacionSintoma>()
                .HasOne(es => es.Evaluacion)
                .WithMany()
                .HasForeignKey(es => es.IdEvaluacion)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EvaluacionSintoma>()
                .HasOne(es => es.Sintoma)
                .WithMany()
                .HasForeignKey(es => es.IdSintoma)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MovimientoPaciente>()
                .HasOne(m => m.SalaOrigen)
                .WithMany()
                .HasForeignKey(m => m.IdSalaOrigen)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<MovimientoPaciente>()
                .HasOne(m => m.SalaDestino)
                .WithMany()
                .HasForeignKey(m => m.IdSalaDestino)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HistorialClinico>()
                .HasOne(h => h.Paciente)
                .WithMany()
                .HasForeignKey(h => h.IdPaciente)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Cita>()
                .HasOne(c => c.Paciente)
                .WithMany()
                .HasForeignKey(c => c.IdPaciente)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Cita>()
                .HasOne(c => c.Medico)
                .WithMany()
                .HasForeignKey(c => c.IdMedico)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
