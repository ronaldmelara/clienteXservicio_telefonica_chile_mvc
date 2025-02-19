using ClienteServicio.helpers;
using ClienteServicio.mappers;
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
            try
            {

                if (id <= 0 || String.IsNullOrEmpty(query))
                {
                    return BadRequest(new { statusCode = 400, message = "Invalid input data." });
                }


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
            catch (Exception ex)
            {
                return StatusCode(Commons.GetStatusCodeFromException(ex), new { message = ex.Message });

            }
            
        }

        //[HttpPut("{id}/enable")]
        //public IActionResult UpdateEnableStatus(int id, [FromBody] bool isEnabled)
        //{
        //    try
        //    {
        //        if (id <= 0)
        //        {
        //            return BadRequest(new { statusCode = 400, message = "Invalid input data." });
        //        }

        //        var service = _serviceRepository.GetServicesById(id);
        //        if (service == null)
        //        {
        //            return NotFound(new { message = "Service not found." });
        //        }

        //        service.enable = isEnabled ? 1 : 0;
        //        _serviceRepository.Update(service); // Actualiza en la base de datos


        //        return Ok(new { message = "Service updated successfully." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(Commons.GetStatusCodeFromException(ex), new { message = ex.Message });
        //    }
           
        //}

        [HttpPut("status")]
        public IActionResult UpdateStatus([FromBody] ServiceViewModel serviceView)
        {
            try
            {
                if (serviceView.idservice <= 0)
                {
                    return BadRequest(new { statusCode = 400, message = "Invalid input data." });
                }

                var service = _serviceRepository.GetServicesById(serviceView.idservice);
                if (service == null)
                {
                    return NotFound(new { message = "Service not found." });
                }

                service.enable = serviceView.enable;
                _serviceRepository.Update(service); // Actualiza en la base de datos


                return Ok(new { message = "Service updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(Commons.GetStatusCodeFromException(ex), new { message = ex.Message });
            }

        }


        [HttpPost("add")]
        public IActionResult AddService([FromBody] Services newService)
        {
          
            try
            {
                if (newService == null || (string.IsNullOrEmpty(newService.service) && newService.idarea <= 0))
                {
                    return BadRequest(new { statusCode = 400, message = "Invalid input data." });
                }


                _serviceRepository.Add(newService);
                return CreatedAtAction(nameof(AddService), new { id = newService.idservice }, newService);
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return StatusCode(Commons.GetStatusCodeFromException(ex), new { message = ex.Message });
            }
        }

    }
}
