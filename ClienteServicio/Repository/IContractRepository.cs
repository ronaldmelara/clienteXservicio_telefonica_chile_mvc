namespace ClienteServicio.Repository
{
    public interface IContractRepository
    {
        List<Dictionary<string, object>> GetAllContracts();
    }
}
