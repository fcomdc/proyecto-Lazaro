using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LazaroBackend.Models
{
    [Table("movimientos_paciente")]
    public class MovimientoPaciente
    {
        [Key]
        [Column("id_movimiento")]
        public int IdMovimiento { get; set; }

        [Required]
        [Column("id_ingreso")]
        public int IdIngreso { get; set; }

        [Column("id_sala_origen")]
        public int? IdSalaOrigen { get; set; }

        [Required]
        [Column("id_sala_destino")]
        public int IdSalaDestino { get; set; }

        [Column("fecha_hora")]
        public DateTime FechaHora { get; set; } = DateTime.UtcNow;

        [Column("motivo")]
        [StringLength(300)]
        public string? Motivo { get; set; }

        [ForeignKey("IdIngreso")]
        public Ingreso? Ingreso { get; set; }

        [ForeignKey("IdSalaOrigen")]
        public Sala? SalaOrigen { get; set; }

        [ForeignKey("IdSalaDestino")]
        public Sala? SalaDestino { get; set; }
    }
}
