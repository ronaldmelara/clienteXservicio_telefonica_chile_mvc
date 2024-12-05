


document.addEventListener('DOMContentLoaded', () => {
    InitEvents();
});


function InitEvents(): void {
    document.getElementById("loginButton")?.addEventListener("click", async () => {
        const userName = (document.getElementById("UserName") as HTMLInputElement).value;
        const password = (document.getElementById("Password") as HTMLInputElement).value;
        const errorMessage = document.getElementById("errorMessage") as HTMLDivElement;

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
            errorMessage.textContent = "Autenticación fallida.";
        } catch (error) {
            errorMessage.textContent = "Error de conexión con el servidor.";
        }
    });
}