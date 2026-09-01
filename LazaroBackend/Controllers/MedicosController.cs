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
    public class MedicosController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public MedicosController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medico>>> GetMedicos()
        {
            return await _context.Medicos.Where(e => e.Activo).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Medico>> GetMedico(int id)
        {
            var entity = await _context.Medicos.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Medico>> PostMedico(Medico entity)
        {
            _context.Medicos.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMedico), new { id = entity.IdMedico }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedico(int id, Medico entity)
        {
            if (id != entity.IdMedico) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedico(int id)
        {
            var entity = await _context.Medicos.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Activo = false;
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
