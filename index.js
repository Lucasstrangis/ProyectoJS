document.addEventListener("DOMContentLoaded", () => {
    const cambiarTemaButton = document.getElementById("cambiar-tema");
    const mostrarDatosButton = document.getElementById("mostrar-datos");
    const enviarDatosButton = document.getElementById("enviar-datos");
    const formulario = document.querySelector("form");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const vaciarCarritoButton = document.getElementById("vaciar-carrito");

    let carrito = [];

    cambiarTemaButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        actualizarCarrito();
    });

    mostrarDatosButton.addEventListener("click", () => {
        const datosAlmacenados = JSON.parse(localStorage.getItem("datos"));
        if (datosAlmacenados) {
            const datosDiv = document.createElement("div");
            datosDiv.innerHTML = `<h3>Datos Almacenados</h3>
                                  <p>Nombre: ${datosAlmacenados.nombre}</p>
                                  <p>Apellido: ${datosAlmacenados.apellido}</p>
                                  <p>Email: ${datosAlmacenados.email}</p>
                                  <p>Mensaje: ${datosAlmacenados.mensaje}</p>`;
            formulario.parentNode.insertBefore(datosDiv, formulario.nextSibling);
        }
    });

    enviarDatosButton.addEventListener("click", (event) => {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("email").value;
        const mensaje = document.getElementById("mensaje").value;

        const datos = {
            nombre,
            apellido,
            email,
            mensaje,
        };

        localStorage.setItem("datos", JSON.stringify(datos));

        const notificacionDiv = document.createElement("div");
        notificacionDiv.textContent = "Datos almacenados con éxito";
        notificacionDiv.style.color = "green";
        formulario.parentNode.insertBefore(notificacionDiv, formulario.nextSibling);

        formulario.reset();
    });

    function actualizarCarrito() {
        listaCarrito.innerHTML = "";
        let total = 0;

        carrito.forEach((producto) => {
            const productoItem = document.createElement("li");
            productoItem.textContent = `${producto.nombre} - Precio: $${producto.precio.toFixed(2)}`;
            listaCarrito.appendChild(productoItem);
            total += producto.precio;
        });

        totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
    }

    function agregarProductoAlCarrito(nombre, precio) {
        const producto = {
            nombre,
            precio,
        };
        carrito.push(producto);
        actualizarCarrito();
    }

    const agregarCarritoButtons = document.querySelectorAll(".agregar-carrito");
    agregarCarritoButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productoContainer = event.target.closest("li");
            const nombre = productoContainer.querySelector("p:nth-child(2)").textContent;
            const precioTexto = productoContainer.querySelector("p:nth-child(3)").textContent;
            const precio = parseFloat(precioTexto.slice(9));

            agregarProductoAlCarrito(nombre, precio);
        });
    });

    vaciarCarritoButton.addEventListener("click", () => {
        carrito = [];
        actualizarCarrito();
    });
});

