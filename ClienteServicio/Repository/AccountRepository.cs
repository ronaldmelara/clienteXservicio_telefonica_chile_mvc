using ClienteServicio.Data;
using ClienteServicio.helpers;
using ClienteServicio.Models;
using Microsoft.EntityFrameworkCore;


namespace ClienteServicio.Repository
{
    public class AccountRepository: IAccountRepository
    {
        private readonly AccountContext _accountContext = null;

        public AccountRepository(AccountContext accountContext)
        {
            _accountContext = accountContext;
        }

        public User Login(string username, string password)
        {
            var user = _accountContext.Users.Include(u=> u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefault(u => u.IdUser == username);

            if (user == null || !PasswordHelper.VerifyPassword(password, user.Pass))
            {
                throw new Exception("Invalid user or password");
            }
            if(user.Active == 0)
            {
                throw new Exception("Account is inactive");
            }
            return user;
        }

        public User GetUser(string username) {
            return _accountContext.Users.FirstOrDefault(u => u.IdUser == username);
        }

        public void Save(User user)
        {
            _accountContext.Users.Add(user);
            _accountContext.SaveChanges();
        }

    }
}
