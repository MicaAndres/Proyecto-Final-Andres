//Array
let carrito = [];

//DOM
let divCanva = document.querySelector(".divCanva");
let divProductos = document.querySelector("#divProductos");
let divCanvaProd = document.querySelector(".divCanvaProd");
let divTotal = document.querySelector(".divTotal");
let finalizarCompra = document.querySelector(".finalizarCompra");

/*async function mostrarCard() {
  const response = await fetch("../json/productos.json");
  return await response.json();
}*/

//FUNCION PARA MOSTRAR LOS PRODUCTOS EN EL HTML
function mostrarCard() {
  fetch("../json/productos.json")
    .then((response) => response.json())
    .then((productos) =>
      productos.forEach((element) => {
        const { img, nombre, precio, id } = element;
        divProductos.innerHTML += `
          <div class="col-sm-12 col-md-6 col-xl-4 ">
            <div class="card mt-3 mb-5 bgCard displayCard tarjeta--nueva">
              <img class="card-img-top imgP" name="imagen" src="${img}" alt="Foto de producto">
              <div class="card-body">
                <h4 class="card-title" name="nombre">${nombre} </h4>
                <p class="card-text" name="precio">$${precio}</p>                       
                <button id="agregar${id}" class="btn-sm enviar iniciarSesion" name="id"  value="Agregar al carritos">
                  Agregar al carrito 
                </button>        
              </div>
            </div>
          </div>
        `;
      })
    );

  agregarProd();
}

//SE AGREGA EL PRODUCTO AL CARRITO, LOCALSTORAGE DESDE JSON
function agregarProd() {
  fetch("../json/productos.json")
    .then((response) => response.json())
    .then((productos) =>
      productos.forEach((producto, index) => {
        document
          .querySelector(`#agregar${index + 1}`)
          .addEventListener("click", () => {
            enviarCarrito(producto);
            //LIBRERIA
            Toastify({
              text: "Al carrito",
              duration: 3000,
              destination: "https://github.com/apvarun/toastify-js",
              newWindow: true,
              close: true,
              gravity: "top",
              position: "center",
              stopOnFocus: true,
              style: {
                background: "linear-gradient(to right, #fceee6, #22333b)",
              },
              onClick: function () {},
            }).showToast();
          });
        localStorage.setItem("carrito", JSON.stringify(carrito));
      })
    );
}

//FUNCION PARA AGREGAR EL PRODUCTO AL CARRITO
function enviarCarrito(producto) {
  const existe = carrito.some((element) => element.id === producto.id);

  const productoAlCarrito = { ...producto, cantidad: 1 };

  if (existe) {
    carrito.map((element) => {
      if (element.id === producto.id) {
        element.cantidad++;
        return element;
      }
    });
  } else {
    carrito.push(productoAlCarrito);
  }

  mostrarElCanva();
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

//MUESTRA EL CANVA DE LOS PRODUCTOS ELEGIDOS
function mostrarElCanva() {
  divCanvaProd.innerHTML = "";

  carrito.forEach((element) => {
    divCanvaProd.innerHTML += `
      <div class="col-sm-12  ">
      <div class="card mt-3 mb-5 bgCard displayCard tarjeta--nueva ">
          <img class="card-img-top imgP" name="imagen" src="${element.img}" alt="Foto de producto">
          <div class="card-body">
              <h4 class="card-title" name="nombre">${element.nombre} </h4>
              <p class="card-text" name="precio">$${element.precio}</p>  
              <p class="card-text" name="cantidad">Elegiste ${element.cantidad} unidades</p>  
              <button id="agregar${element.id}" class="btn-sm enviar iniciarSesion botonBorrar" name="id"  value="eliminar"> Vaciar carrito</button>     
          </div>       
        </div>
        
    </div>
      `;
  });
  calcularTotal();
  borrarDelCanva();
}

//FUNCION PARA BORRAR TODOS LOS PORDUCTOS DEL CARRITO
function borrarDelCanva() {
  let botonBorrar = document.querySelectorAll(".botonBorrar");
  botonBorrar.forEach((element) => {
    element.addEventListener("click", (e) => {
      let id = parseInt(e.target.id);
      carrito = carrito.filter((element) => {
        return element.id == id;
      });
      mostrarElCanva();
      divTotal.innerHTML = ``;
      localStorage.setItem("carrito", JSON.stringify(carrito));
    });
  });
}

//CALCULAR EL TOTAL DE PRODUCTOS ELEGIDOS EN EL CARRITO
const calcularTotal = () => {
  let total = carrito.reduce(
    (acumulador, iterador) => acumulador + iterador.precio * iterador.cantidad,
    0
  );

  divTotal.innerHTML = `
  <div class ="precioTotal">
      <h4>El total es de $${total} </h4>
  </div>`;
};

function finalizar() {
  finalizarCompra.addEventListener("click", (e) => {
    e.preventDefault();

    divCanvaProd.innerHTML = "";
    divTotal.innerHTML = "";
    carrito = [];
    //LIBRERIA
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Gracias ! Tu pedido llegará en 7/10 días",
      showConfirmButton: false,
      timer: 2300,
    });
  });
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

mostrarCard();
finalizar();
