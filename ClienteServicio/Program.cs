using ClienteServicio.Data;
using ClienteServicio.helpers;
using ClienteServicio.Models;
using ClienteServicio.Repository;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<CustomerContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); });
builder.Services.AddDbContext<ServiceContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); } );
builder.Services.AddDbContext<ContractsContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); });
builder.Services.AddDbContext<AreaContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); });
builder.Services.AddDbContext<AccountContext>(op => { op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); });
builder.Services.AddScoped<ICustomerRepository, CustormerRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IContractRepository, ContractRepository>();
builder.Services.AddScoped<IAreaRepository, AreaRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();


builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(option =>
{
    option.IdleTimeout = TimeSpan.FromMinutes(20);
    option.Cookie.HttpOnly = true;
});
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new AuthorizeFilter());
});


// Configuración de autenticación con cookies
builder.Services.AddAuthentication("CookieAuth")
    .AddCookie("CookieAuth", options =>
    {
        options.Cookie.Name = "UserLoginCookie";
        options.LoginPath = "/Account/Login"; // Ruta para redirigir al login
        options.AccessDeniedPath = "/Account/AccessDenied"; // Ruta para redirigir si no tiene acceso
    });

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

app.UseAuthentication();

app.UseSession();
app.UseAuthorization();

app.UseMiddleware<SessionValidationMiddleware>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
