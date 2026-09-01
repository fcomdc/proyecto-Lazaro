using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("evaluaciones")]
    public class Evaluacion
    {
        [Key]
        [Column("id_evaluacion")]
        public int IdEvaluacion { get; set; }

        [Required]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Column("fecha_hora")]
        public DateTime FechaHora { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("motivo_consulta")]
        [StringLength(500)]
        public string MotivoConsulta { get; set; } = null!;

        [Column("descripcion_sintomas")]
        [StringLength(1000)]
        public string? DescripcionSintomas { get; set; }

        [Column("observaciones")]
        [StringLength(1000)]
        public string? Observaciones { get; set; }

        [Required]
        [Column("estado")]
        [StringLength(30)]
        public string Estado { get; set; } = "pendiente";

        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }
    }
}
