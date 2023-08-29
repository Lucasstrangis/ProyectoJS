$(document).ready(() => {
    const cambiarTemaButton = $("#cambiar-tema");
    const mostrarDatosButton = $("#mostrar-datos");
    const enviarDatosButton = $("#enviar-datos");
    const formulario = $("form");
    const listaCarrito = $("#lista-carrito");
    const totalCarrito = $("#total-carrito");
    const vaciarCarritoButton = $("#vaciar-carrito");

    let carrito = [];

    cambiarTemaButton.click(() => {
        $("body").toggleClass("dark-theme");
        actualizarCarrito();
    });

    mostrarDatosButton.click(() => {
        const datosAlmacenados = JSON.parse(localStorage.getItem("datos"));
        if (datosAlmacenados) {
            const datosDiv = $("<div>").html(`
                <h3>Datos Almacenados</h3>
                <p>Nombre: ${datosAlmacenados.nombre}</p>
                <p>Apellido: ${datosAlmacenados.apellido}</p>
                <p>Email: ${datosAlmacenados.email}</p>
                <p>Mensaje: ${datosAlmacenados.mensaje}</p>
            `);
            formulario.after(datosDiv);
        }
    });

    enviarDatosButton.click((event) => {
        event.preventDefault();
        const nombre = $("#nombre").val();
        const apellido = $("#apellido").val();
        const email = $("#email").val();
        const mensaje = $("#mensaje").val();

        const datos = {
            nombre,
            apellido,
            email,
            mensaje,
        };

        localStorage.setItem("datos", JSON.stringify(datos));

        const notificacionDiv = $("<div>")
            .text("Datos almacenados con éxito")
            .css("color", "green");
        formulario.after(notificacionDiv);
        formulario.trigger("reset");
    });

    fetch("productos.json")
        .then(response => response.json())
        .then(productos => {
            const productosLista = $(".productos-lista");
            productos.forEach(producto => {
                const productoItem = $("<li>");
                productoItem.html(`
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>${producto.nombre}</p>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                    <button class="agregar-carrito">Agregar al Carrito</button>
                `);
                productosLista.append(productoItem);
            });

            const agregarCarritoButtons = $(".agregar-carrito");
            agregarCarritoButtons.click((event) => {
                const productoContainer = $(event.target).closest("li");
                const nombre = productoContainer.find("p:nth-child(2)").text();
                const precioTexto = productoContainer.find("p:nth-child(3)").text();
                const precio = parseFloat(precioTexto.slice(9));

                agregarProductoAlCarrito(nombre, precio);
            });
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
        });

    vaciarCarritoButton.click(() => {
        carrito = [];
        actualizarCarrito();
    });

    function agregarProductoAlCarrito(nombre, precio) {
        const producto = {
            nombre,
            precio,
        };
        carrito.push(producto);
        actualizarCarrito();
    }

    function actualizarCarrito() {
        listaCarrito.empty();
        let total = 0;

        carrito.forEach(producto => {
            const productoItem = $("<li>").text(`${producto.nombre} - Precio: $${producto.precio.toFixed(2)}`);
            listaCarrito.append(productoItem);
            total += producto.precio;
        });

        totalCarrito.text(`Total: $${total.toFixed(2)}`);
    }
});
