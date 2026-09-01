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
    public class SintomasController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public SintomasController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sintoma>>> GetSintomas()
        {
            return await _context.Sintomas.Where(e => e.Activo).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sintoma>> GetSintoma(int id)
        {
            var entity = await _context.Sintomas.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Sintoma>> PostSintoma(Sintoma entity)
        {
            _context.Sintomas.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSintoma), new { id = entity.IdSintoma }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSintoma(int id, Sintoma entity)
        {
            if (id != entity.IdSintoma) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSintoma(int id)
        {
            var entity = await _context.Sintomas.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Activo = false;
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
