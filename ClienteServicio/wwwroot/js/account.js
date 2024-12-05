"use strict";
document.addEventListener('DOMContentLoaded', () => {
    InitEvents();
});
function InitEvents() {
    document.getElementById("loginButton")?.addEventListener("click", async () => {
        const userName = document.getElementById("UserName").value;
        const password = document.getElementById("Password").value;
        const errorMessage = document.getElementById("errorMessage");
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
                // Si hay una redirecci�n, seguirla
                window.location.href = response.url;
                return;
            }
            if (!response.ok) {
                const errorResponse = await response.json();
                errorMessage.textContent = errorResponse.message || "Error desconocido.";
                return;
            }
            // Si la solicitud no redirige ni tiene errores expl�citos, manejamos otros casos aqu�
            errorMessage.textContent = "Autenticaci�n fallida.";
        }
        catch (error) {
            errorMessage.textContent = "Error de conexi�n con el servidor.";
        }
    });
}
