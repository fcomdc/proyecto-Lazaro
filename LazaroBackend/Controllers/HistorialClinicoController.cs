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
    public class HistorialClinicoController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public HistorialClinicoController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistorialClinico>>> GetHistorialClinico()
        {
            return await _context.HistorialClinico.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HistorialClinico>> GetHistorialClinico(int id)
        {
            var entity = await _context.HistorialClinico.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<HistorialClinico>> PostHistorialClinico(HistorialClinico entity)
        {
            _context.HistorialClinico.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHistorialClinico), new { id = entity.IdHistorial }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHistorialClinico(int id, HistorialClinico entity)
        {
            if (id != entity.IdHistorial) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHistorialClinico(int id)
        {
            var entity = await _context.HistorialClinico.FindAsync(id);
            if (entity == null) return NotFound();
            
            _context.HistorialClinico.Remove(entity);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
