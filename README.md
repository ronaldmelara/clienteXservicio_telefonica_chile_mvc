# Registro de Servicios Contratados por Cliente

Este proyecto es una aplicación web desarrollada para **Telefónica Tech Chile** con el objetivo de llevar un registro de los servicios contratados por los clientes. Utiliza el patrón de diseño MVC (Model-View-Controller) y está construida sobre ASP.NET Core, Bootstrap y TypeScript para una interfaz moderna y funcional.

## Características

- **Autenticación y Autorización:**
  - Login basado en claims y cookies con roles de usuario: `Admin` y `Viewer`.
  - Restricción de acceso a los recursos según el rol del usuario.
  - Gestión segura de contraseñas con encriptación usando BCrypt.

- **Gestor de Usuarios y Roles:**
  - Creación de usuarios y asignación de roles.
  - Visualización de usuarios registrados y sus privilegios.

- **Registro de Servicios:**
  - Administración de los servicios contratados por clientes.
  - Visualización y edición de los servicios disponibles.

- **Interfaz de Usuario:**
  - Uso de Bootstrap para un diseño responsivo y moderno.
  - Indicadores de carga y validación de formularios amigables para el usuario.

## Tecnologías Utilizadas

- **Backend:** ASP.NET Core 6.0
- **Frontend:** Bootstrap 5, TypeScript
- **Base de Datos:** Microsoft SQL Server
- **Autenticación:** Claims + Cookies

## Configuración Inicial

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/ronaldmelara/clienteXservicio_telefonica_chile_mvc.git
   cd tu-repositorio
   ```

2. **Configurar la Base de Datos**
   - Crear una base de datos en SQL Server utilizando el script de `schema.sql` proporcionado.
   - Actualizar la cadena de conexión en el archivo `appsettings.json`.

   ```json
   "ConnectionStrings": {
       "DefaultConnection": "Server=CL-TCCT-5CD3331\\SQLEXPRESS;Database=CustomersTech;User Id=techRoot;Password=123456789;Encrypt=Yes;TrustServerCertificate=Yes;"
   }
   ```

3. **Ejecutar Migraciones (si aplica)**
   ```bash
   dotnet ef database update
   ```

4. **Restaurar Dependencias**
   ```bash
   dotnet restore
   ```

5. **Ejecutar la Aplicación**
   ```bash
   dotnet run
   ```

## Uso

### Roles y Permisos
- **Admin:**
  - Puede gestionar usuarios, roles y servicios contratados.
  - Acceso a la administración completa del sistema.
- **Viewer:**
  - Solo tiene acceso de lectura a los registros de clientes y servicios.

### Registro de Usuarios
- Los usuarios deben ser registrados a través del endpoint correspondiente o por un administrador.
- Las contraseñas se almacenan de manera segura utilizando BCrypt.

### Endpoints Protegidos
- Todos los controladores están protegidos con filtros de autorización.
- El middleware verifica que las sesiones sean válidas y redirige al login en caso de ser necesario.

## Estructura del Proyecto

```
Proyecto
├── Controllers
│   ├── AccountController.cs
│   ├── AreaController.cs
│   ├── ClienteController.cs
│   ├── HomeController.cs
│   ├── ServicesController.cs
│   └── ViewController.cs
├── Models
│   ├── Area.cs
│   ├── Contract.cs
│   ├── Customer.cs
│   ├── ErrowViewModel.cs
│   ├── RegisterViewModel.cs
│   ├── Services.cs
│   ├── UserRole.cs
│   ├── User.cs
│   ├── Role.cs
│   └── LoginViewModel.cs
├── Views
│   ├── Account
│   │   └── Login.cshtml
│   ├── Cliente
│   │   └── Cliente.cshtml
│   ├── Home
│   │   └── Index.cshtml
│   ├── Servicio
│   │   └── Servicio.cshtml
│   └── Shared
│       └── _Layout.cshtml
├── wwwroot
│   └── css / js / img
└── Program.cs
```

## Contribución

Si deseas contribuir al proyecto:
1. Crea un fork del repositorio.
2. Realiza tus cambios en una rama nueva.
3. Envía un pull request con una descripción detallada de los cambios realizados.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

---

**Contacto:**
- **Autor:** Ronald Melara
- **Correo:** ronald.melaraserrano@telefonica.com/ronald.melara@gmail.com
