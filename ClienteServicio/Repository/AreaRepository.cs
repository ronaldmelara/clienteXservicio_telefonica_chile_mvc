using ClienteServicio.Data;
using ClienteServicio.Models;
using Microsoft.EntityFrameworkCore;

namespace ClienteServicio.Repository
{
    public class AreaRepository: IAreaRepository
    {
        private readonly AreaContext _customerContext = null;

        public AreaRepository(AreaContext customerContext)
        {
            _customerContext = customerContext;
        }

        public List<Area> GetAllAreas()
        {
            return _customerContext.Areas
                .Include(a=> a.Services)
                .Select(c => new Area()
            {
                idarea = c.idarea,
                area = c.area,
                Services = c.Services.Select(s=> new Services { 
                idservice = s.idservice,
                service = s.service,
                idarea = s.idarea,
                enable = s.enable
                }).ToList()
            }).ToList();
        }
    }
}
