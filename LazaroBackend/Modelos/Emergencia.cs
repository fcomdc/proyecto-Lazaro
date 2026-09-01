using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("emergencias")]
    public class Emergencia
    {
        [Key]
        [Column("id_emergencia")]
        public int IdEmergencia { get; set; }

        [Required]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Column("id_evaluacion")]
        public int? IdEvaluacion { get; set; }

        [Column("fecha_hora")]
        public DateTime FechaHora { get; set; } = DateTime.UtcNow;

        [Column("latitud", TypeName = "decimal(10,7)")]
        public decimal? Latitud { get; set; }

        [Column("longitud", TypeName = "decimal(10,7)")]
        public decimal? Longitud { get; set; }

        [Column("descripcion")]
        [StringLength(1000)]
        public string? Descripcion { get; set; }

        [Required]
        [Column("prioridad")]
        [StringLength(20)]
        public string Prioridad { get; set; } = "alta";

        [Required]
        [Column("estado")]
        [StringLength(30)]
        public string Estado { get; set; } = "pendiente";

        [Column("ambulancia_solicitada")]
        public bool AmbulanciaSolicitada { get; set; } = false;

        [Column("fecha_verificacion")]
        public DateTime? FechaVerificacion { get; set; }

        [Column("verificado_por")]
        public int? VerificadoPor { get; set; }

        [ForeignKey("IdPaciente")]
        public Paciente? Paciente { get; set; }

        [ForeignKey("IdEvaluacion")]
        public Evaluacion? Evaluacion { get; set; }

        [ForeignKey("VerificadoPor")]
        public Usuario? Usuario { get; set; }
    }
}
