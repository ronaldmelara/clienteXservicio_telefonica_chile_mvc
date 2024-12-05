using ClienteServicio.Models;

namespace ClienteServicio.Repository
{
    public interface IAccountRepository
    {
        User Login(string username, string password);
        User GetUser(string username);
        void Save(User user);
    }
}
