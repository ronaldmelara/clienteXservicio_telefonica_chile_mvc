using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClienteServicio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ErrorController : Controller
    {
        [AllowAnonymous]
        [HttpGet("{statusCode}")]
        public IActionResult HandleError(int statusCode)
        {
            var defaultMessages = new Dictionary<int, string>
        {
            { 400, "Solicitud incorrecta." },
            { 401, "No autorizado." },
            { 403, "Prohibido." },
            { 404, "Recurso no encontrado." },
            { 500, "Error interno del servidor." }
        };

            var message = defaultMessages.ContainsKey(statusCode)
                ? defaultMessages[statusCode]
                : "Ocurrió un error.";

            return StatusCode(statusCode, new { statusCode, message });
        }
    }
}
