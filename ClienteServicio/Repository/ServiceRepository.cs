using ClienteServicio.Data;
using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public class ServiceRepository: IServiceRepository
    {
        private readonly ServiceContext _customerContext = null;

        public ServiceRepository(ServiceContext customerContext)
        {
            _customerContext = customerContext;
        }

        public List<Services> GetAllServices()
        {
            return _customerContext.Services.Select(c => new Services()
            {
                idservice = c.idservice,
                service = c.service,
                idarea = c.idarea,
            }).ToList();
        }

       
    }
}
