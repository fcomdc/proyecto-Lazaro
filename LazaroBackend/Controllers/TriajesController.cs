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
    public class TriajesController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public TriajesController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Triaje>>> GetTriajes()
        {
            return await _context.Triajes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Triaje>> GetTriaje(int id)
        {
            var entity = await _context.Triajes.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Triaje>> PostTriaje(Triaje entity)
        {
            _context.Triajes.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTriaje), new { id = entity.IdTriaje }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTriaje(int id, Triaje entity)
        {
            if (id != entity.IdTriaje) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTriaje(int id)
        {
            var entity = await _context.Triajes.FindAsync(id);
            if (entity == null) return NotFound();
            
            _context.Triajes.Remove(entity);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
