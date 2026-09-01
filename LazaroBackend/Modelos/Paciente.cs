using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("pacientes")]
    public class Paciente
    {
        [Key]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Required]
        [Column("numero_expediente")]
        [StringLength(20)]
        public string NumeroExpediente { get; set; } = null!;

        [Required]
        [Column("nombre")]
        [StringLength(50)]
        public string Nombre { get; set; } = null!;

        [Required]
        [Column("apellido")]
        [StringLength(50)]
        public string Apellido { get; set; } = null!;

        [Column("fecha_nacimiento", TypeName = "date")]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        [Column("genero")]
        [StringLength(10)]
        public string Genero { get; set; } = null!;

        [Column("direccion")]
        [StringLength(200)]
        public string? Direccion { get; set; }

        [Column("telefono")]
        [StringLength(20)]
        public string? Telefono { get; set; }

        [Column("email")]
        [StringLength(100)]
        public string? Email { get; set; }

        [Column("tipo_sangre")]
        [StringLength(5)]
        public string? TipoSangre { get; set; }

        [Column("alergias")]
        [StringLength(500)]
        public string? Alergias { get; set; }

        [Column("contacto_emergencia")]
        [StringLength(100)]
        public string? ContactoEmergencia { get; set; }

        [Column("telefono_emergencia")]
        [StringLength(20)]
        public string? TelefonoEmergencia { get; set; }

        [Column("activo")]
        public bool Activo { get; set; } = true;

        [Column("fecha_registro")]
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}
