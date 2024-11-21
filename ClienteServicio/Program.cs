using ClienteServicio.Data;
using ClienteServicio.Models;
using ClienteServicio.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<CustomerContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); });
builder.Services.AddDbContext<ServiceContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); } );
builder.Services.AddDbContext<ContractsContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); });
builder.Services.AddDbContext<AreaContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); });
builder.Services.AddScoped<ICustomerRepository, CustormerRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IContractRepository, ContractRepository>();
builder.Services.AddScoped<IAreaRepository, AreaRepository>();
var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
