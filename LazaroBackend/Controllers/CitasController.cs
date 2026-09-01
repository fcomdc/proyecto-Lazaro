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
    public class CitasController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public CitasController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cita>>> GetCitas()
        {
            return await _context.Citas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cita>> GetCita(int id)
        {
            var entity = await _context.Citas.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Cita>> PostCita(Cita entity)
        {
            _context.Citas.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCita), new { id = entity.IdCita }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCita(int id, Cita entity)
        {
            if (id != entity.IdCita) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCita(int id)
        {
            var entity = await _context.Citas.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Estado = "cancelada"; // o 'inactiva' dependiendo de tu logica
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
