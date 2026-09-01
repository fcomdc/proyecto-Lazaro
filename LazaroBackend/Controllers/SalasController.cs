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
    public class SalasController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public SalasController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sala>>> GetSalas()
        {
            return await _context.Salas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sala>> GetSala(int id)
        {
            var entity = await _context.Salas.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Sala>> PostSala(Sala entity)
        {
            _context.Salas.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSala), new { id = entity.IdSala }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSala(int id, Sala entity)
        {
            if (id != entity.IdSala) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSala(int id)
        {
            var entity = await _context.Salas.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Estado = "cancelada"; // o 'inactiva' dependiendo de tu logica
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
