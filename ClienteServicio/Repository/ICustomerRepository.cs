using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public interface ICustomerRepository
    {
        List<Customer> GetAllCustomers();
    }
}
