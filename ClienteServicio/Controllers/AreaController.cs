using ClienteServicio.Models;
using ClienteServicio.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClienteServicio.Controllers
{
    [Authorize]
    public class AreaController : Controller
    {

        private readonly IAreaRepository _areaRepository;
        public AreaController(IAreaRepository areaRepository)
        {
            _areaRepository = areaRepository;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllAreas()
        {
            List<Area> data = new List<Area>();
            data = _areaRepository.GetAllAreas();
            if (!data.Any())
            {
                return NotFound();
            }
            return Ok(data);
        }
    }
}
