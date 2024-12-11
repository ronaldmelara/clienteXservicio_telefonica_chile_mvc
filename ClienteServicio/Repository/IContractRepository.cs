using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public interface IContractRepository
    {
        List<Dictionary<string, object>> GetAllContracts();

        Contract GetContract(int serviceId, int rut, string dv);

        void UpdateContract(Contract updatedContract);
    }
}
