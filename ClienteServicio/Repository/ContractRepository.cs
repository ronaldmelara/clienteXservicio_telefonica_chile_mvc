using ClienteServicio.Data;
using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public class ContractRepository: IContractRepository
    {
        private readonly ContractsContext _customerContext = null;

        public ContractRepository(ContractsContext customerContext)
        {
            _customerContext = customerContext;
        }

        public List<Dictionary<string,object>> GetAllContracts()
        {
            return _customerContext.GetContracts();
        }
    }
}
