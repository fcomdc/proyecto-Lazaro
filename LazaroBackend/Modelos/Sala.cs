using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("salas")]
    public class Sala
    {
        [Key]
        [Column("id_sala")]
        public int IdSala { get; set; }

        [Required]
        [Column("nombre")]
        [StringLength(100)]
        public string Nombre { get; set; } = null!;

        [Column("ubicacion")]
        [StringLength(150)]
        public string? Ubicacion { get; set; }

        [Required]
        [Column("capacidad")]
        public int Capacidad { get; set; }

        [Required]
        [Column("estado")]
        [StringLength(30)]
        public string Estado { get; set; } = "disponible";
    }
}
