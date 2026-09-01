using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("historial_clinico")]
    public class HistorialClinico
    {
        [Key]
        [Column("id_historial")]
        public int IdHistorial { get; set; }

        [Required]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Column("id_medico")]
        public int? IdMedico { get; set; }

        [Column("id_cita")]
        public int? IdCita { get; set; }

        [Column("id_ingreso")]
        public int? IdIngreso { get; set; }

        [Column("fecha_hora")]
        public DateTime FechaHora { get; set; } = DateTime.UtcNow;

        [Column("motivo")]
        [StringLength(500)]
        public string? Motivo { get; set; }

        [Column("diagnostico")]
        [StringLength(1000)]
        public string? Diagnostico { get; set; }

        [Column("observaciones")]
        [StringLength(2000)]
        public string? Observaciones { get; set; }

        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }

        [ForeignKey("IdMedico")]
        public Medico? Medico { get; set; }

        [ForeignKey("IdCita")]
        public Cita? Cita { get; set; }

        [ForeignKey("IdIngreso")]
        public Ingreso? Ingreso { get; set; }
    }
}
