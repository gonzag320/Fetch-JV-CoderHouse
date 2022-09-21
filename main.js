async function returnStock(){
    const [stockJson] = await Promise.all([
        fetch("stock.json")
    ])
    let stock = await stockJson.json()
    stock = JSON.stringify(stock.productos)
    localStorage.setItem("stockDisponible", stock)
}
const productos = JSON.parse(localStorage.getItem('stockDisponible'))

// localStorage.clear()

const registroExitoso = JSON.parse(sessionStorage.getItem("datosDeUsuario"));
const botonInicioSesion = document.getElementById("botonInicioSesion");
const displayFormularioRegistro = document.getElementById('formRegistro');

let totalCalculado = 0;

const informacionImportante = document.getElementById("informacionImportante");
let carrito = [];

const storageEnCarrito = JSON.parse(sessionStorage.getItem("carritoUsuario"))

const storageTotalEnCarrito = JSON.parse(sessionStorage.getItem("totalCarritoUsuario"))

const loginExitoso = JSON.parse(sessionStorage.getItem("login"));

const formularioInicioSesion = document.getElementById("formInicioSesion");



function verificarLogin(){

formularioInicioSesion.addEventListener("submit", (e) => {

    const correoVerif = document.getElementById("correoVerificacion").value;
    const contraseñaVerif = document.getElementById("contraseñaVerificacion").value;

    e.preventDefault();

    if(registroExitoso === null){
        Swal.fire({
            title: 'No encontramos tus credenciales',
            text: `Verifica que estas registado`,
            icon: 'question',
            showConfirmButton: 'Ok',
            timer: 2000,
    })
    }else if((correoVerif === registroExitoso.correo) && (contraseñaVerif === registroExitoso.contraseña)){
            setTimeout(() =>{
                let timerInterval
                    Swal.fire({
                    title: 'Cargando los ultimos productos',
                    html: 'Recuperando la base de datos',
                    timer: 2500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                        // b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                    }).then(() => {
                        returnStock();
                        formularioInicioSesion.style.display = "none";
                        sessionStorage.setItem("login", "true")
                        window.location.reload()   
                    })
            },250)
    }
    else{
            Swal.fire({
                title: 'Error al ingresar datos',
                text: `Verifica que has ingresado correctamente tus datos ${registroExitoso.nombre}`,
                icon: 'error',
                showConfirmButton: 'Ok',
                timer: 2000,
        })

    }

})
}



function cambiarVistaContraseña(){
    const contraseñaOculta = document.getElementById("contraseñaVerificacion")
    if(contraseñaOculta.type === "password"){
        contraseñaOculta.type = "text"
    }else{
        contraseñaOculta.type = "password"
    }   
}

if ((registroExitoso != null) && (loginExitoso === true)){
        formularioInicioSesion.style.display = "none";

            Swal.fire({
            title: 'Ya te has registrado',
            text: `Continuemos tu proceso de compra ${registroExitoso.nombre}`,
            icon: 'success',
            timer: 2000,
        }).then(() => {
            mostrarProductos();
            })
}

if (!(storageEnCarrito != null)){
// es tu primer login y tu carrito esta vacio
console.log('Aun no se ha agregado por primera vez al carrito')
}
else if(storageEnCarrito.length === 0){
    console.log(storageEnCarrito);
    console.log('Ya se agrego al carrito pero ahora esta vacio')
}
else{
    setTimeout(() =>{
        let timerInterval
            Swal.fire({
            title: 'Buscando tu carrito de compra',
            html: 'Cargando tus productos',
            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                // b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
            }).then(() => {
                console.log(storageEnCarrito);
                console.log('Ya hay algo en tu carrito');
                carrito = storageEnCarrito
                totalCalculado = storageTotalEnCarrito
                console.log(carrito);
                renderProductos();
                renderTotal();
                calcularTotal();
                toastCarritoConProductos ();
            })
    },2000)
        
    function toastCarritoConProductos () {
        Toastify({
            text: (`Carrito cargado`),
            className: "toastCarritoConProducto",
            duration: 2500,
            close: true,
            gravity: "bottom", 
            position: "center", 
            stopOnFocus: true, 
          }).showToast();
        }
}

// Este es el encargado de renderizar las cards para poder comprar 
function mostrarProductos(){
    const contenedor = document.getElementById("producto-contenedor");
    productos.forEach( producto => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `<div class="card-image" id="supTotal">
                            <img class="imgCards" id="suplemento${producto.id}" src=${producto.img}>
                            <br>
                            <span class="cardText" id="card-title" >Producto: ${producto.nombre}</span>
                            <br>
                            <span class="cardText" id="card-precio">Precio: ${producto.precio}</span>
                            <br>
                            <span class="cardText" id="card-marca">Marca de producto: ${producto.marca}</span>
                            <br>
                            <span class="cardText" id="card-descripcion">Descripcion: ${producto.descripcion}</span>
                            <br>
                            <br>
                            <button type="button" class="botonCard" onclick="agregarProductoAlCarrito(${producto.id})" id="botonDeCompra${producto.id}">Comprar ahora</button>
                            <br>
                            <a href="${producto.video}" target="blank" id="esParaTi">¿Este producto es para mi?</a>
                        </div>
                        `
        contenedor.appendChild(div);
        
    });

};




function agregarProductoAlCarrito(id) {
    let producto = productos.find(producto => producto.id === id);
    let productoEnCarrito = carrito.find(productoEnCarrito => productoEnCarrito.id === id);

    productoEnCarrito ? aumentarCantidad()
    : pushearCarrito()

    renderProductos();
    renderTotal();
    calcularTotal();

    function aumentarCantidad(){
        productoEnCarrito.cantidad ++
        alertToastAgregar();
        carritoJson = JSON.stringify(carrito);
        sessionStorage.setItem("carritoUsuario", carritoJson);
    
    }

function pushearCarrito(){
    producto.cantidad = 1;
    productoEnCarrito = 1;
    carrito.push(producto)
    alertToastAgregar();
    let carritoJson = JSON.stringify(carrito);
    sessionStorage.setItem("carritoUsuario", carritoJson);
    } 

function alertToastAgregar () {
    Toastify({
        text: (`Has agregado ${producto.nombre} a tu carrito de compra.`),
        duration: 2500,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
    }
}

// Aqui ya se renderizan los productos del carrito a la pantalla
function renderProductos(){
    let carritoHTML = document.getElementById("carrito")
    let HTMLcarrito = ""
    carrito.forEach((producto, id) =>{
        HTMLcarrito += `
        <div class="card-carrito" id="supComprado">
                            <span class="cardText" id="card-title" > Compra: ${producto.nombre}</span>
                            <br>
                            <br>
                            <span class="cardText" id="card-precio">Precio: ${producto.precio}</span>
                            <br>
                            <br>
                            <span class="cardText" id="card-precio">Cantidad comprado: ${producto.cantidad}</span>
                            <br>
                            <br>
                            <button type="button" class="botonEliminar" onclick="eliminarProducto(${id})" id="botonEliminar${producto.id}">Eliminar</button>
                        </div>
        `
    })

    carritoHTML.innerHTML = HTMLcarrito

    document.body.appendChild(carritoHTML)

}

// Esto renderiza el carrito de compras en texto
function renderTotal(){
    let totalHTML = document.getElementById("totales")
   totalHTML.innerHTML = `            
   <div>
    <h2 id="totalCompra"></h2>
    </div>
    `
    document.body.appendChild(totalHTML)
}

// Con esto ya se pueden eliminar los productos
function eliminarProducto(id) {

    carrito[id].cantidad--;

    if (carrito[id].cantidad == 0){
        carrito.splice(id, 1)
    }

    renderProductos();
    calcularTotal();

    carritoJson = JSON.stringify(carrito);
    sessionStorage.setItem("carritoUsuario", carritoJson);

    swal.fire({
        title: 'Borrado!',
        icon: 'success',
        text: 'El producto ha sido borrado con éxito',
    })
}

// Esta parte ya calcula los totales de mi producto y los imprime
function calcularTotal(){
    let bloqueCarrito = document.getElementById('totalCompra')
    
    let total = 0;
    carrito.forEach((producto) =>{
        total += producto.precio * producto.cantidad
    })

    const totalFinal = document.getElementById("totalCompra")
    totalFinal.innerHTML = `<h3> Total de compra: $${total} 
                            <button type="button" class="botonCompraTotal" onclick="comprarProductos()" id="botonDeCompraFinal">Finalizar Compra</button>
                            <h3/>`
    totalCalculado = total;
    let totalJson = JSON.stringify(totalCalculado);
    sessionStorage.setItem("totalCarritoUsuario", totalJson);

    if (totalCalculado === 0){
        bloqueCarrito.style.display = ('none')
    } 

}

// Se borra la sesion storage y se fuerza el cierre, esto es para evitar compras dobles y crear un nuevo ciclo
function comprarProductos(){
    const informacionEntrega = JSON.parse(sessionStorage.getItem("datosDeUsuario"));

    let {nombre, direccion, correo,telefono} = informacionEntrega;

    Swal.fire({
        title: `¿Listo para finalizar tu compra?`,
        html:'<img class="imgCierre" id="compra" src=imgs/Confirmacion.png style="width: 80px;" style="height: 80px;">',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Listo!',
        cancelButtonText: 'Todavia no!'
      }).then((result) => {

        result.isConfirmed === false ? Swal.fire('Agrega/Quita los productos que necesites')
        : result.isConfirmed === true && totalCalculado === 0 ? carritoEnCeros()
        : compraFinalizada();      
      })

        function compraFinalizada (){



            setTimeout(() =>{
                let timerInterval
                    Swal.fire({
                    title: 'Comprado',
                    html: `Gracias por tu compra ${nombre}, enviaremos tu recibo de compra a ${correo}, tu(s) producto(s) se enviarán a la direccion ubicada en ${direccion} y cualquier inconveniente o emergencia nos contactaremos contigo al numero ${telefono}`,
                    timer: 6500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                        // b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                    }).then(() => {
                        localStorage.clear()
                        sessionStorage.clear()
                        window.location.reload()     
                    })
            },500)

            // Swal.fire({
            //     title: 'Comprado',
            //     text: `Gracias por tu compra ${nombre}, enviaremos tu recibo de compra a ${correo}, tu(s) producto(s) se enviarán a la direccion ubicada en ${direccion} y cualquier inconveniente o emergencia nos contactaremos contigo al numero ${telefono}`,
            //     icon: 'success',
            //     showConfirmButton: 'Ok',
            //     timer: 5000,
            // }) .then(() => {
            // localStorage.clear()
            // sessionStorage.clear()
            // window.location.reload()     
            //   })

        }   

        function carritoEnCeros(){
            Swal.fire({
                icon: 'error',
                title: 'No pudimos concretar tu compra',
                text: 'Necesitas tener productos en tu carrito para continuar',
              })
        }
}