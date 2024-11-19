using ClienteServicio.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ClienteServicio.Data
{
    public class ContractsContext: DbContext
    {
        DbContext myDbContext;
        public ContractsContext(DbContextOptions<ContractsContext> options) : base(options)
        {
            myDbContext = this;
        }

        public List<Dictionary<string, object>> GetContracts() 
        {
            var result = new List<Dictionary<string, object>>();

            using (var command = Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "GetCustomerServices";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                this.Database.OpenConnection();

                using (var reader =  command.ExecuteReader())
                {
                    while ( reader.Read())
                    {
                        var row = new Dictionary<string, object>();
                        for (var i = 0; i < reader.FieldCount; i++)
                        {
                            if(i >= 2)
                            {
                                if(reader.GetValue(i) == DBNull.Value)
                                {
                                    row[reader.GetName(i)] = false;
                                }
                                else
                                {
                                    row[reader.GetName(i)] = true;
                                }
                            }else
                            {
                                row[reader.GetName(i)] = reader.GetValue(i);
                            }
                           
                        }
                        result.Add(row);
                    }
                }
            }
            return result;
        }

        public DbSet<Contract> Contracts { get; set; }

    }
}
