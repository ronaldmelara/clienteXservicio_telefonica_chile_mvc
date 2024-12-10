"use strict";
document.addEventListener('DOMContentLoaded', () => {
    InitEvents();
});
function InitEvents() {
    document.getElementById("loginButton")?.addEventListener("click", async (event) => {
        // Evitar el comportamiento predeterminado del botón si es parte de un formulario
        event.preventDefault();
        const form = document.querySelector(".needs-validation"); // Selecciona el formulario
        if (!form)
            return; // Verifica que el formulario exista
        if (!form.checkValidity()) {
            form.classList.add("was-validated"); // Aplica las clases de Bootstrap para mostrar errores
            return; // Detiene el proceso si el formulario no es válido
        }
        const loginButton = document.getElementById("loginButton");
        const userName = document.getElementById("UserName").value;
        const password = document.getElementById("Password").value;
        const errorMessage = document.getElementById("errorMessage");
        $(loginButton).attr("disabled", "disabled");
        // Preparar datos
        const loginData = {
            UserName: userName,
            Password: password,
        };
        try {
            const response = await fetch("/Account/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });
            if (response.redirected) {
                // Si hay una redirección, seguirla
                window.location.href = response.url;
                return;
            }
            if (!response.ok) {
                const errorResponse = await response.json();
                errorMessage.textContent = errorResponse.message || "Error desconocido.";
                return;
            }
            // Si la solicitud no redirige ni tiene errores explícitos, manejamos otros casos aquí
            errorMessage.textContent = "Autenticación fallida. Inténtelo nuevamente.";
            $(loginButton).removeAttr("disabled");
        }
        catch (error) {
            errorMessage.textContent = "Error de conexión con el servidor.";
            $(loginButton).removeAttr("disabled");
        }
    });
}
