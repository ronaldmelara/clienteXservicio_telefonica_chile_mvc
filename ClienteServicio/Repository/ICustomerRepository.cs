using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public interface ICustomerRepository
    {
        List<Customer> GetAllCustomers();
        void Update(Customer customer);
        void Delete(Customer customer);
        Customer Add(Customer customer);
        Customer GetCustomerById(int id);
    }
}
