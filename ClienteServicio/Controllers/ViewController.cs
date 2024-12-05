using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClienteServicio.Controllers
{
    public class ViewController : Controller
    {
        [Authorize]
        public IActionResult Home()
        {
            return View("~/Views/Home/Index.cshtml");
        }

        public IActionResult Service()
        {
            return View("~/Views/Servicio/Servicio.cshtml");
        }

        public IActionResult Customer()
        {
            return View("~/Views/Cliente/Cliente.cshtml");
        }
    }
}
