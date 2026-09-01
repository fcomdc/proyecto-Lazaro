using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("triaje")]
    public class Triaje
    {
        [Key]
        [Column("id_triaje")]
        public int IdTriaje { get; set; }

        [Required]
        [Column("id_evaluacion")]
        public int IdEvaluacion { get; set; }

        [Required]
        [Column("nivel")]
        [StringLength(20)]
        public string Nivel { get; set; } = null!;

        [Column("temperatura", TypeName = "decimal(4,1)")]
        public decimal? Temperatura { get; set; }

        [Column("frecuencia_cardiaca")]
        public int? FrecuenciaCardiaca { get; set; }

        [Column("presion_arterial")]
        [StringLength(20)]
        public string? PresionArterial { get; set; }

        [Column("saturacion_oxigeno", TypeName = "decimal(5,2)")]
        public decimal? SaturacionOxigeno { get; set; }

        [Column("observaciones")]
        [StringLength(1000)]
        public string? Observaciones { get; set; }

        [Column("fecha_hora")]
        public DateTime FechaHora { get; set; } = DateTime.UtcNow;

        [ForeignKey("IdEvaluacion")]
        public Evaluacion? Evaluacion { get; set; }
    }
}
