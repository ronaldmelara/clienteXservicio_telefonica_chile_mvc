using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public interface IServiceRepository
    {
        List<Services> GetAllServices();
    }
}
