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
    public class TrasladosController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public TrasladosController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Traslado>>> GetTraslados()
        {
            return await _context.Traslados.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Traslado>> GetTraslado(int id)
        {
            var entity = await _context.Traslados.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Traslado>> PostTraslado(Traslado entity)
        {
            _context.Traslados.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTraslado), new { id = entity.IdTraslado }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTraslado(int id, Traslado entity)
        {
            if (id != entity.IdTraslado) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTraslado(int id)
        {
            var entity = await _context.Traslados.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Estado = "cancelada"; // o 'inactiva' dependiendo de tu logica
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
