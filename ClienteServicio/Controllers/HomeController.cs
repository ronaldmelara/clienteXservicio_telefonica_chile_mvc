using ClienteServicio.Models;
using ClienteServicio.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Text.Json;

namespace ClienteServicio.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly ICustomerRepository _customerRepository;
        private readonly IContractRepository _contractRepository;
        private readonly IServiceRepository _serviceRepository;
        public HomeController(ILogger<HomeController> logger, ICustomerRepository customerRepository, IContractRepository contractRepository, IServiceRepository serviceRepository)
        {
            _logger = logger;

            _customerRepository = customerRepository;
            _contractRepository = contractRepository;
            _serviceRepository = serviceRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public IActionResult GetAllContracts()
        {
            List<Dictionary<string, object>> data = new List<Dictionary<string, object>>();
            data = _contractRepository.GetAllContracts();
            if (!data.Any()) {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpGet]
        public IActionResult GetAllServices()
        {
            List<Services> data = new List<Services>();
            data = _serviceRepository.GetAllServices();
            if (!data.Any())
            {
                return NotFound();
            }
            return Ok(data);
        }
    }
}
