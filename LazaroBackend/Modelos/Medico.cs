using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("medicos")]
    public class Medico
    {
        [Key]
        [Column("id_medico")]
        public int IdMedico { get; set; }

        [Column("id_especialidad")]
        public int IdEspecialidad { get; set; }

        [Required]
        [Column("nombre")]
        [StringLength(50)]
        public string Nombre { get; set; } = null!;

        [Required]
        [Column("apellido")]
        [StringLength(50)]
        public string Apellido { get; set; } = null!;

        [Required]
        [Column("numero_licencia")]
        [StringLength(30)]
        public string NumeroLicencia { get; set; } = null!;

        [Column("telefono")]
        [StringLength(20)]
        public string? Telefono { get; set; }

        [Column("email")]
        [StringLength(100)]
        public string? Email { get; set; }

        [Column("anos_experiencia")]
        public int? AnosExperiencia { get; set; }

        [Column("disponible")]
        public bool Disponible { get; set; } = true;

        [Column("activo")]
        public bool Activo { get; set; } = true;

        [ForeignKey("IdEspecialidad")]
        public virtual Especialidad? Especialidad { get; set; }
    }
}
