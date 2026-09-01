using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("evaluacion_sintomas")]
    public class EvaluacionSintoma
    {
        [Column("id_evaluacion")]
        public int IdEvaluacion { get; set; }

        [Column("id_sintoma")]
        public int IdSintoma { get; set; }

        [Column("intensidad")]
        [StringLength(20)]
        public string? Intensidad { get; set; }

        [Column("observaciones")]
        [StringLength(300)]
        public string? Observaciones { get; set; }

        [ForeignKey("IdEvaluacion")]
        public Evaluacion? Evaluacion { get; set; }

        [ForeignKey("IdSintoma")]
        public Sintoma? Sintoma { get; set; }
    }
}
