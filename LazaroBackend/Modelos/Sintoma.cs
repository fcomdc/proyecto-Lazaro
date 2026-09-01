using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("sintomas")]
    public class Sintoma
    {
        [Key]
        [Column("id_sintoma")]
        public int IdSintoma { get; set; }

        [Required]
        [Column("nombre")]
        [StringLength(100)]
        public string Nombre { get; set; } = null!;

        [Column("descripcion")]
        [StringLength(300)]
        public string? Descripcion { get; set; }

        [Column("activo")]
        public bool Activo { get; set; } = true;
    }
}
