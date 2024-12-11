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

        public Contract GetContract(int serviceId, int rut, string dv)
        {
            return _customerContext.Contracts.FirstOrDefault(c => c.rut == rut && c.dv == dv && c.idservice == serviceId);
        }


        // Actualizar un contrato
        public void UpdateContract(Contract updatedContract)
        {

            try
            {
                // Buscar el contrato a actualizar por IdService y IdCustomer
                var existingContract = _customerContext.Contracts
                    .FirstOrDefault(c => c.rut == updatedContract.rut && c.dv == updatedContract.dv && c.idservice == updatedContract.idservice);

                if (existingContract != null)
                {
                    // Si el contrato existe, actualiza sus propiedades
                    existingContract.active = updatedContract.active;
                    //existingContract.Updated = DateTime.Now;  // Actualiza la fecha de modificación

                    // Puedes agregar aquí más campos que quieras actualizar

                    // Marca el contrato como actualizado (modificado) para que EF lo considere como un cambio
                    _customerContext.Contracts.Update(existingContract);
                }
                else
                {
                    // Si no existe, puedes agregar uno nuevo
                    _customerContext.Contracts.Add(updatedContract);
                }

                _customerContext.SaveChanges();

            }
            catch(Exception ex)
            {
                throw;
            }
           
        }
    }
}
