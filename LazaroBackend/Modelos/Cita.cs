using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("citas")]
    public class Cita
    {
        [Key]
        [Column("id_cita")]
        public int IdCita { get; set; }

        [Required]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Required]
        [Column("id_medico")]
        public int IdMedico { get; set; }

        [Required]
        [Column("fecha_hora")]
        public DateTime FechaHora { get; set; }

        [Column("motivo")]
        [StringLength(500)]
        public string? Motivo { get; set; }

        [Required]
        [Column("estado")]
        [StringLength(30)]
        public string Estado { get; set; } = "programada";

        [Column("observaciones")]
        [StringLength(500)]
        public string? Observaciones { get; set; }

        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }
        
        [ForeignKey("IdMedico")]
        public Medico? Medico { get; set; }
    }
}
