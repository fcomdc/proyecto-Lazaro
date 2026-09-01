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
    public class EmergenciasController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public EmergenciasController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Emergencia>>> GetEmergencias()
        {
            return await _context.Emergencias.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Emergencia>> GetEmergencia(int id)
        {
            var entity = await _context.Emergencias.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Emergencia>> PostEmergencia(Emergencia entity)
        {
            _context.Emergencias.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEmergencia), new { id = entity.IdEmergencia }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmergencia(int id, Emergencia entity)
        {
            if (id != entity.IdEmergencia) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmergencia(int id)
        {
            var entity = await _context.Emergencias.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Estado = "cancelada"; // o 'inactiva' dependiendo de tu logica
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
