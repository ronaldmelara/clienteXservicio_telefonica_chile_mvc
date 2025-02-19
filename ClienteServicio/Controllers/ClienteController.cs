using ClienteServicio.helpers;
using ClienteServicio.mappers;
using ClienteServicio.Models;
using ClienteServicio.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClienteServicio.Controllers
{
    [Authorize]
    [Route("api/v1/customer/")]
    public class ClienteController : Controller
    {
        public IActionResult Index()
        {
            return View("Cliente");
        }

        private ICustomerRepository _customerRepository;

        public ClienteController(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        [HttpGet("all")]
        public IActionResult GetAllCustomer()
        {
            try
            {
                List<CustomerViewModel> data = new List<CustomerViewModel>();
                var result = _customerRepository.GetAllCustomers();
                if (result.Count == 0)
                {
                    return NotFound(new { statusCode = 404, message = "No customers found." });
                }

                return Ok(Commons.ConvertDtoListToEntityList<CustomerViewModel, Customer>(result));
            }
            catch (Exception ex)
            {
                return StatusCode(Commons.GetStatusCodeFromException(ex), new { message = ex.Message });
            }
           
        }

        [HttpPut("name")]
        public IActionResult UpdateName([FromBody] CustomerViewModel newCustomer)
        {
            try
            {
                if (newCustomer == null || (newCustomer.rut <= 0 && string.IsNullOrEmpty(newCustomer.dv))) {
                    return BadRequest(new { statusCode = 400, message = "Invalid input data." });
                }
                var customer = _customerRepository.GetCustomerByRut(newCustomer.rut, newCustomer.dv);
                if (customer == null)
                {
                    return NotFound(new { message = "Customer not found." });
                }

                customer.customer = newCustomer.customer;
                _customerRepository.Update(customer); // Actualiza en la base de datos


                return Ok(new { message = "Customer updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(Commons.GetStatusCodeFromException(ex), new { message = ex.Message });
            }
            
        }


        [HttpPost("add")]
        public IActionResult AddCustomer([FromBody] CustomerViewModel newCustomer)
        {
            try
            {
                if (newCustomer == null)
                {
                    return BadRequest(new { statusCode = 400, message = "Invalid input data." });
                }

                var customer = Commons.ConvertDtoToEntity<Customer,CustomerViewModel>(newCustomer);
                _customerRepository.Add(customer);
                return CreatedAtAction(nameof(AddCustomer), new { id = newCustomer.rut }, newCustomer);
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return StatusCode(Commons.GetStatusCodeFromException(ex), new { message = ex.Message });
            }
        }


        [HttpDelete("{id}/{dv}/down")]
        public IActionResult Remove(int id, string dv)
        {
            try
            {
                if (id <= 0 || string.IsNullOrEmpty(dv))
                {
                    return BadRequest(new { statusCode = 400, message = "Invalid input data." });
                }
                var cust = _customerRepository.GetCustomerByRut(id, dv);
                if (cust == null)
                {
                    return NotFound(new { message = "Customer not found." });
                }
                _customerRepository.Delete(cust);

                return Ok(new { message = "Customer removed successfully." });
            }
            catch(Exception ex)
            {
                return StatusCode(Commons.GetStatusCodeFromException(ex), new { message = ex.Message });
            }
            

            
        }
    }
}
