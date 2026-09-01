using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("traslados")]
    public class Traslado
    {
        [Key]
        [Column("id_traslado")]
        public int IdTraslado { get; set; }

        [Required]
        [Column("id_emergencia")]
        public int IdEmergencia { get; set; }

        [Column("origen")]
        [StringLength(300)]
        public string? Origen { get; set; }

        [Column("destino")]
        [StringLength(300)]
        public string? Destino { get; set; }

        [Column("fecha_solicitud")]
        public DateTime FechaSolicitud { get; set; } = DateTime.UtcNow;

        [Column("fecha_salida")]
        public DateTime? FechaSalida { get; set; }

        [Column("fecha_llegada")]
        public DateTime? FechaLlegada { get; set; }

        [Required]
        [Column("estado")]
        [StringLength(30)]
        public string Estado { get; set; } = "solicitado";

        [Column("observaciones")]
        [StringLength(500)]
        public string? Observaciones { get; set; }

        [ForeignKey("IdEmergencia")]
        public Emergencia? Emergencia { get; set; }
    }
}
