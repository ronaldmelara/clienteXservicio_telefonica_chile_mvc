using ClienteServicio.helpers;
using ClienteServicio.Models;
using ClienteServicio.Repository;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace ClienteServicio.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {

        private readonly IAccountRepository _accountRepository;
        public AccountController(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult Login()
        {
            // Si el usuario ya tiene sesión activa, redirigir a Home
            if (HttpContext.Session.GetString("UserId") != null)
            {
                return RedirectToAction("Home", "View");
            }
            return View("Account");
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] LoginViewModel model)
        {
            try
            {
                var user = _accountRepository.Login(model.UserName, model.Password);
                HttpContext.Session.SetString("UserId", user.IdUser);
                HttpContext.Session.SetString("Role", user.UserRoles.First().Role.Rol);

                // Crear claims para identificar al usuario
                var claims = new List<Claim>
                {
                        new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.NameIdentifier, user.IdUser),
                    new Claim(ClaimTypes.Role, user.UserRoles.First().Role.Rol)
                };

                // Crear el ticket de autenticación
                var claimsIdentity = new ClaimsIdentity(claims, "CookieAuth");
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true, // Mantener la sesión incluso si se cierra el navegador
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(30)
                };

                HttpContext.SignInAsync("CookieAuth", new ClaimsPrincipal(claimsIdentity), authProperties);


                return RedirectToAction("Home", "View");
            }
            catch (Exception ex)
            {
                ViewBag.Error = ex.Message;
                return View("Account");
            }

        }

        // POST: Registrar un nuevo usuario

        [HttpPost]
        public IActionResult Register([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Verificar si el usuario ya existe
            var existingUser = _accountRepository.GetUser(model.UserName);
            if (existingUser != null)
            {
                ModelState.AddModelError("", "El usuario ya está registrado.");
                return View(model);
            }

            // Crear nuevo usuario
            var newUser = new User
            {
                IdUser = model.UserName,
                Name = model.Name,
                Email = model.Email,
                Pass = PasswordHelper.HashPassword(model.Password), // Encriptar contraseña
                Active = 1,
                Created = DateTime.Now
            };
            _accountRepository.Save(newUser);


            return RedirectToAction("Login");
        }


        [AllowAnonymous]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
    }
}
