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
    public class TratamientosController : ControllerBase
    {
        private readonly LazaroDbContext _context;

        public TratamientosController(LazaroDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tratamiento>>> GetTratamientos()
        {
            return await _context.Tratamientos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Tratamiento>> GetTratamiento(int id)
        {
            var entity = await _context.Tratamientos.FindAsync(id);
            if (entity == null) return NotFound();
            return entity;
        }

        [HttpPost]
        public async Task<ActionResult<Tratamiento>> PostTratamiento(Tratamiento entity)
        {
            _context.Tratamientos.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTratamiento), new { id = entity.IdTratamiento }, entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTratamiento(int id, Tratamiento entity)
        {
            if (id != entity.IdTratamiento) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTratamiento(int id)
        {
            var entity = await _context.Tratamientos.FindAsync(id);
            if (entity == null) return NotFound();
            
            entity.Estado = "cancelada"; // o 'inactiva' dependiendo de tu logica
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
