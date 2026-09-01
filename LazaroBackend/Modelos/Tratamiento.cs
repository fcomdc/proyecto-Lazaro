using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("tratamientos")]
    public class Tratamiento
    {
        [Key]
        [Column("id_tratamiento")]
        public int IdTratamiento { get; set; }

        [Required]
        [Column("id_ingreso")]
        public int IdIngreso { get; set; }

        [Required]
        [Column("id_medico")]
        public int IdMedico { get; set; }

        [Required]
        [Column("nombre")]
        [StringLength(150)]
        public string Nombre { get; set; } = null!;

        [Column("descripcion")]
        [StringLength(1000)]
        public string? Descripcion { get; set; }

        [Column("fecha_inicio")]
        public DateTime FechaInicio { get; set; } = DateTime.UtcNow;

        [Column("fecha_fin")]
        public DateTime? FechaFin { get; set; }

        [Required]
        [Column("estado")]
        [StringLength(30)]
        public string Estado { get; set; } = "activo";

        [ForeignKey("IdIngreso")]
        public Ingreso? Ingreso { get; set; }

        [ForeignKey("IdMedico")]
        public Medico? Medico { get; set; }
    }
}
