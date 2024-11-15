using ClienteServicio.Data;
using ClienteServicio.Models;
using Microsoft.EntityFrameworkCore;

namespace ClienteServicio.Repository
{
    public class CustormerRepository : ICustomerRepository
    {
        private readonly CustomerContext _customerContext = null;

        public CustormerRepository(CustomerContext customerContext)
        {
            _customerContext = customerContext;
        }

        public List<Customer> GetAllCustomers()
        {
            return  _customerContext.Customers.Select(c => new Customer()
            {
                idcustomer = c.idcustomer,
                customer = c.customer
            }).ToList();
        }

    }
}
