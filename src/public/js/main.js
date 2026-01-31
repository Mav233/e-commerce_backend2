function showToast(message, type = "success") {
    let background = "#16a34a"; // verde

    if (type === "error") background = "#dc2626";
    if (type === "info") background = "#2563eb";
    if (type === "warning") background = "#f59e0b";

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        stopOnFocus: true,
        style: {
            background
        }
    }).showToast();
}

/* Detectar mensajes por query params */
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("registered")) {
        showToast("Registro exitoso 🎉");
    }

    if (params.get("login") === "success") {
        showToast("Sesión iniciada correctamente 👋", "info");
    }

    if (params.get("created")) {
        showToast("Producto creado correctamente ✅");
    }

    if (params.get("error")) {
        showToast("Ocurrió un error", "error");
    }
});