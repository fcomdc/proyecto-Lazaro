using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("especialidades")]
    public class Especialidad
    {
        [Key]
        [Column("id_especialidad")]
        public int IdEspecialidad { get; set; }

        [Required]
        [Column("nombre")]
        [StringLength(80)]
        public string Nombre { get; set; } = null!;

        [Column("descripcion")]
        [StringLength(300)]
        public string? Descripcion { get; set; }

        [Column("activo")]
        public bool Activo { get; set; } = true;
    }
}
