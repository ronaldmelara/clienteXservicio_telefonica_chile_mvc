using ClienteServicio.Data;
using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public class ServiceRepository : IServiceRepository
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
                Area = new Area
                {
                    idarea = c.Area.idarea,
                    area = c.Area.area
                },
                enable = c.enable
            }).ToList();
        }

        public List<Services> GetServicesByArea(int idarea)
        {
            return _customerContext.Services.Select(c => new Services()
            {
                idservice = c.idservice,
                service = c.service,
                idarea = c.idarea,
                Area = new Area
                {
                    idarea = c.Area.idarea,
                    area = c.Area.area
                },
                enable = c.enable
            }).Where(c => c.idarea == idarea).ToList();
        }

        public Services GetServicesById(int idService)
        {
            return _customerContext.Services.FirstOrDefault(c => c.idservice == idService);
        }


        public void Update(Services services)
        {
            _customerContext.Services.Update(services);
            _customerContext.SaveChanges();
        }

        public int Add(Services service)
        {
            if (service == null)
                throw new ArgumentNullException(nameof(service));

            _customerContext.Services.Add(service);
            _customerContext.SaveChanges(); // Guarda los cambios en la base de datos

            return service.idservice;
        }
    }
}
