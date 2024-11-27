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

        public void Update(Customer customer)
        {
            _customerContext.Update(customer);
            _customerContext.SaveChanges();
        }

        public Customer Add(Customer customer)
        {
            _customerContext.Add(customer);
            _customerContext.SaveChanges();

            return customer;
        }

        public void Delete(Customer customer)
        {
            _customerContext.Remove(customer);
            _customerContext.SaveChanges();
        }

        public Customer GetCustomerById(int id)
        {
            return _customerContext.Customers.FirstOrDefault(c=> c.idcustomer == id);
        }
    }
}
