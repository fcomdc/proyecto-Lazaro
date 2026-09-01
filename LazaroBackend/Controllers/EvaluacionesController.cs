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
    public class EvaluacionesController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public EvaluacionesController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evaluacion>>> GetEvaluaciones()
        {
            return await _context.Evaluaciones.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Evaluacion>> GetEvaluacion(int id)
        {
            var entity = await _context.Evaluaciones.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Evaluacion>> PostEvaluacion(Evaluacion entity)
        {
            _context.Evaluaciones.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEvaluacion), new { id = entity.IdEvaluacion }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvaluacion(int id, Evaluacion entity)
        {
            if (id != entity.IdEvaluacion) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvaluacion(int id)
        {
            var entity = await _context.Evaluaciones.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Estado = "cancelada"; // o 'inactiva' dependiendo de tu logica
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
