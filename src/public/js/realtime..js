const socket = io();

socket.on("products", products => {
    const list = document.getElementById("products");
    list.innerHTML = "";

    products.forEach(p => {
        list.innerHTML += `<li>${p.title} - $${p.price}</li>`;
    });
});