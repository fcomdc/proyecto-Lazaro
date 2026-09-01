using LazaroBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LazaroBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimientosPacienteController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public MovimientosPacienteController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimientoPaciente>>> GetMovimientosPaciente()
        {
            return await _context.MovimientosPaciente.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovimientoPaciente>> GetMovimientoPaciente(int id)
        {
            var entity = await _context.MovimientosPaciente.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<MovimientoPaciente>> PostMovimientoPaciente(MovimientoPaciente entity)
        {
            _context.MovimientosPaciente.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMovimientoPaciente), new { id = entity.IdMovimiento }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovimientoPaciente(int id, MovimientoPaciente entity)
        {
            if (id != entity.IdMovimiento) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovimientoPaciente(int id)
        {
            var entity = await _context.MovimientosPaciente.FindAsync(id);
            if (entity == null) return NotFound();
            
            _context.MovimientosPaciente.Remove(entity);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
