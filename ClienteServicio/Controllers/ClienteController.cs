using Microsoft.AspNetCore.Mvc;

namespace ClienteServicio.Controllers
{
    public class ClienteController : Controller
    {
        public IActionResult Index()
        {
            return View("Cliente");
        }
    }
}
