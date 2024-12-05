using ClienteServicio.Models;
using ClienteServicio.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace ClienteServicio.Controllers
{
    [Authorize]
    [Route("api/v1/services/")]
    public class ServicioController : Controller
    {
        private readonly IServiceRepository _serviceRepository;

        public ServicioController(IServiceRepository serviceRepository) { 
            _serviceRepository = serviceRepository;
        }
        public IActionResult Index()
        {
            return View("Servicio");
        }

        [HttpGet("area/{id}")]
        public IActionResult Search(int id, [FromQuery] string query)
        {
            // Filtrar servicios relacionados al área y la consulta
            List<Services> data = _serviceRepository.GetServicesByArea(id)
                .Where(s => s.service.Contains(query, StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (!data.Any())
            {
                return NotFound();
            }
            // Retornar la lista de servicios como JSON
            return Ok(data);
        }

        [HttpPut("{id}/enable")]
        public IActionResult UpdateEnableStatus(int id, [FromBody] bool isEnabled)
        {
            var service = _serviceRepository.GetServicesById(id);
            if (service == null)
            {
                return NotFound(new { message = "Service not found." });
            }

            service.enable = isEnabled ? 1:0;
            _serviceRepository.Update(service); // Actualiza en la base de datos
           

            return Ok(new { message = "Service updated successfully." });
        }


        [HttpPost("add")]
        public IActionResult AddService([FromBody] Services newService)
        {
            if (newService == null)
            {
                return BadRequest("El servicio no puede ser nulo.");
            }

            try
            {
                _serviceRepository.Add(newService);
                return CreatedAtAction(nameof(AddService), new { id = newService.idservice }, newService);
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return StatusCode(500, $"Error al agregar el servicio: {ex.Message}");
            }
        }

    }
}
