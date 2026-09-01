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
    public class EspecialidadesController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public EspecialidadesController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Especialidad>>> GetEspecialidades()
        {
            return await _context.Especialidades.Where(e => e.Activo).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Especialidad>> GetEspecialidad(int id)
        {
            var entity = await _context.Especialidades.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Especialidad>> PostEspecialidad(Especialidad entity)
        {
            _context.Especialidades.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEspecialidad), new { id = entity.IdEspecialidad }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEspecialidad(int id, Especialidad entity)
        {
            if (id != entity.IdEspecialidad) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEspecialidad(int id)
        {
            var entity = await _context.Especialidades.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Activo = false;
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
