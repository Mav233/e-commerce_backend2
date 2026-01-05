const params = new URLSearchParams(window.location.search);

if (params.get("checkout") === "success") {
    Toastify({
        text: "✅ Compra realizada con éxito",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "#16a34a"
        }
    }).showToast();

    // limpiar la URL
    window.history.replaceState({}, document.title, window.location.pathname);
}
