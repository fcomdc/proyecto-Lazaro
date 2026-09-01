using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("ingresos")]
    public class Ingreso
    {
        [Key]
        [Column("id_ingreso")]
        public int IdIngreso { get; set; }

        [Required]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Column("id_medico_responsable")]
        public int? IdMedicoResponsable { get; set; }

        [Column("id_sala")]
        public int? IdSala { get; set; }

        [Column("id_emergencia")]
        public int? IdEmergencia { get; set; }

        [Column("fecha_ingreso")]
        public DateTime FechaIngreso { get; set; } = DateTime.UtcNow;

        [Column("fecha_alta")]
        public DateTime? FechaAlta { get; set; }

        [Column("motivo_ingreso")]
        [StringLength(500)]
        public string? MotivoIngreso { get; set; }

        [Column("diagnostico")]
        [StringLength(1000)]
        public string? Diagnostico { get; set; }

        [Required]
        [Column("estado")]
        [StringLength(30)]
        public string Estado { get; set; } = "activo";

        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }

        [ForeignKey("IdMedicoResponsable")]
        public Medico? Medico { get; set; }

        [ForeignKey("IdSala")]
        public Sala? Sala { get; set; }

        [ForeignKey("IdEmergencia")]
        public Emergencia? Emergencia { get; set; }
    }
}
