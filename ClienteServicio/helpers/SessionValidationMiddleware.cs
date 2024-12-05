namespace ClienteServicio.helpers
{
    public class SessionValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public SessionValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Rutas excluidas del middleware (página de login y archivos estáticos)
            var allowedPaths = new[] { "/account/login", "/account/logout", "/account/register", "/favicon.ico" };
            var path = context.Request.Path.ToString().ToLower();

            if (allowedPaths.Any(p => path.StartsWith(p)) || path.Contains("/css/") || path.Contains("/js/") || path.Contains("/img/"))
            {
                await _next(context);
                return;
            }

            // Verificar si la sesión está activa
            if (context.Session.GetString("UserId") == null)
            {
                context.Response.Redirect("/Account/Login");
                return;
            }

            // Continuar con la ejecución de la solicitud
            await _next(context);
        }
    }
}
