﻿using ClienteServicio.Models;
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
            List<Customer> data = new List<Customer>();
            data = _customerRepository.GetAllCustomers();
            if (!data.Any())
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPut("{rut}/name")]
        public IActionResult UpdateName(int rut, [FromBody] Customer newCustomer)
        {
            var customer = _customerRepository.GetCustomerByRut(rut);
            if (customer == null)
            {
                return NotFound(new { message = "Customer not found." });
            }

            customer.customer = newCustomer.customer;
            _customerRepository.Update(customer); // Actualiza en la base de datos


            return Ok(new { message = "Customer updated successfully." });
        }


        [HttpPost("add")]
        public IActionResult AddCustomer([FromBody] Customer newCustomer)
        {
            if (newCustomer == null)
            {
                return BadRequest("El cliente no puede ser nulo.");
            }

            try
            {
                _customerRepository.Add(newCustomer);
                return CreatedAtAction(nameof(AddCustomer), new { id = newCustomer.rut }, newCustomer);
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return StatusCode(500, $"Error al agregar el cliente: {ex.Message}");
            }
        }


        [HttpDelete("{id}/down")]
        public IActionResult Remove(int id)
        {
            var cust = _customerRepository.GetCustomerByRut(id);
            if (cust == null)
            {
                return NotFound(new { message = "Customer not found." });
            }

            _customerRepository.Delete(cust);
            
            return Ok(new { message = "Customer removed successfully." });
        }
    }
}
