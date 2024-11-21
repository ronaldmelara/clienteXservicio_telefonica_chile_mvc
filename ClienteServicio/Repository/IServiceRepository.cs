using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public interface IServiceRepository
    {
        List<Services> GetAllServices();
        List<Services> GetServicesByArea(int idarea);
        Services GetServicesById(int idService);
        void Update(Services services);
        int Add(Services service);
    }
}
