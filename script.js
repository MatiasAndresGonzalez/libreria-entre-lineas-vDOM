// Array de libros
const libros = [
  {
    id: 1,
    titulo: "Una nube - Golpeteo",
    autor: "Vuelta Canela",
    precio: 19200,
    stock: 325,
    imagen: "nube.png",
  },
  {
    id: 2,
    titulo: "Yo tengo un auto",
    autor: "Vuelta Canela",
    precio: 25400,
    stock: 240,
    imagen: "auto.png",
  },
  {
    id: 3,
    titulo: "Pájaros en mi ventana",
    autor: "Agua de Sol",
    precio: 18750,
    stock: 360,
    imagen: "pajaros.png",
  },
  {
    id: 4,
    titulo: "Regalitos",
    autor: "Juan Quintero",
    precio: 32100,
    stock: 120,
    imagen: "regalitos.png",
  },
  {
    id: 5,
    titulo: "Canciones de las emociones",
    autor: "Las Magdalenas",
    precio: 14650,
    stock: 54,
    imagen: "emociones.png",
  },
  {
    id: 6,
    titulo: "Todas las hojas se están volando",
    autor: "Mariana Baggio",
    precio: 19500,
    stock: 410,
    imagen: "hojas.png",
  },
  {
    id: 7,
    titulo: "En el mar",
    autor: "Agua de Sol",
    precio: 22750,
    stock: 212,
    imagen: "mar.png",
  },
  {
    id: 8,
    titulo: "El dinosaurio Romario",
    autor: "Pequeño Pez",
    precio: 31650,
    stock: 11,
    imagen: "dinosaurio.png",
  },
  {
    id: 9,
    titulo: "Para jugar con las palabras",
    autor: "Nilocos",
    precio: 19800,
    stock: 163,
    imagen: "palabras.png",
  },
  {
    id: 10,
    titulo: "Jugar en la biblioteca",
    autor: "Matías Reck y Daniela Szpilbarg",
    precio: 22350,
    stock: 25,
    imagen: "biblioteca.png",
  },
];

const listaLibros = document.getElementById("lista-libros"); // nuevo maca: referencia al contenedor del catálogo
const carritoDiv = document.getElementById("carrito"); // nuevo maca: contenedor donde se listan los ítems del carrito
const totalDiv = document.getElementById("total"); // nuevo maca: contenedor del total del carrito
const iconoCarrito = document.getElementById("carrito-icono"); // nuevo maca: botón en navbar
const carritoContainer = document.getElementById("carrito-container"); // nuevo maca: dropdown que se despliega

let carrito = cargarCarritoLS(); // nuevo paul :en vez de guardar los datos en array vacio se guardan en una funcion llamada cargarCarritoLS

// / **************************** LOCALSTORAGE**************************

// Cargar carrito desde LocalStorage
function cargarCarritoLS() {
  const carritoLS = localStorage.getItem("carritoLibros"); // llamamos a lo que hay cargado en carritoLibros
  return carritoLS ? JSON.parse(carritoLS) : []; // si hay algo cargado lo parsea para mostrar como array y si no debuelbe un array vacio
}

// Guardar carrito en LocalStorage
function guardarCarritoLS() {
  localStorage.setItem("carritoLibros", JSON.stringify(carrito)); // seteamos carritoLibros
}

cargarCarritoLS();
// ************************************************************************************

// Mostrar catálogo
function mostrarLibros() {
  /* limpiamos la lista */
  if (!listaLibros) return; // nuevo maca: evita error en páginas sin catálogo (index/preguntas/contacto)
  listaLibros.innerHTML = "";
  /* reccorremos el array libros */
  libros.forEach((libro) => {
    /* creamos nueva etiqueta html y le damos una clase */
    const card = document.createElement("div");
    card.className = "card";

    /* cargamos los los valores de cada libro a la etiqueta crada */
    card.innerHTML = `
      <img src="img/${libro.imagen}" alt="${libro.titulo}">
      <h3 style="padding: 0; margin-bottom: 0">${libro.titulo}</h3>
      <p style="padding: 0; margin-bottom: 0"><strong>Autor:</strong> ${libro.autor}</p>
      <p style="padding: 0; margin-bottom: 0"><strong>Precio:</strong> $${libro.precio}</p>
      <p><strong>Stock:</strong> ${libro.stock}</p>
      <button id="agregar-${libro.id}">Agregar al carrito</button>
    `;
    /* agregamos a card como hijo de la listaLibros*/
    listaLibros.appendChild(card);

    /* añadimos un escuchador de evento clic al boton agregar al carrito y llamamos la funcion agregarLibro */
    document
      .getElementById(`agregar-${libro.id}`)
      .addEventListener("click", () => agregarLibro(libro.id));
  });
}

// agregar al carrito
function agregarLibro(id) {
  /* buscamos el id del producto a agregar */
  const libro = libros.find((l) => l.id === id);
  /* verificamos si hay stock o si el libro existe */
  if (!libro || libro.stock <= 0) {
    alert("Libro sin stock disponible");
    return;
  }
  /* verificamos si ya existe un libo cargado al carrito con ese id */
  const enCarrito = carrito.find((l) => l.id === id);

  /*  */
  if (enCarrito) {
    enCarrito.cantidad++; // sumamos 1 a la cantiday existene en el carrito
    enCarrito.subtotal = enCarrito.cantidad * enCarrito.precio; // calculamos el el precio por la cantidad y lo guardamos en subtotal
  } else {
    // si no hay cargado aun ese id, lo cargamos
    carrito.push({ ...libro, cantidad: 1, subtotal: libro.precio }); // hacemos la carga con spread operator
  }

  libro.stock--; // restamos uno al estock de libros
  mostrarLibros(); // mostramos nuevamente catalogo con sus cambios
  mostrarCarrito(); // mostramos nuevamente carrito con sus cambios
  actualizarContador(); // nuevo maca: refresca el contador en el ícono
  guardarCarritoLS(); // nuevo para guardar en LS
}

// mostramos carrito
function mostrarCarrito() {
  /* iniciamos el carrito en blanco */
  if (!carritoDiv) return; // nuevo maca: evita error si el dropdown no existe en la página
  carritoDiv.innerHTML = "";

  /* recorremos carrito y agregamos lo que vamos a mostrar */
  carrito.forEach((item) => {
    /* creamos nuevo elemento "div" y le damos una clase */
    const titulo = document.createElement("div");
    titulo.classList.add("titulo");

    titulo.innerHTML = `<b>${item.titulo}</b> <button id="disminuye-${item.id}" class="resta">-</button> x${item.cantidad} <button id="aumenta-${item.id}" class="suma">+</button> - Subtotal: $${item.subtotal} <button id="eliminarItem-${item.id}" class="rojo">X</button>`; // insertamos por medio del metodo innerHTML lo que queremos mostrar en titulo

    /* agregamos el titulo como hijo del carritoDiv */
    carritoDiv.appendChild(titulo);

    document
      .getElementById(`disminuye-${item.id}`) // obtenemos el id del boton menos
      .addEventListener("click", () => { // añadimos un evento clic
        restaCantidad(item.id); // llamamos a la funcion restaCantidad que disminuye uno a la cantidad y devuelve uno al stock 
        if(actualizarContador === 0){ // si el contador queda en 0...
          carritoContainer.classList.toggle("oculto"); // se oculta automaticamente el carrito vacio
        }
      });

    document
      .getElementById(`aumenta-${item.id}`) // obtenemos el id del boton mas
      .addEventListener("click", () => sumaCantidad(item.id)); // añadimos un evento clic y llamamos a la funcion sumaCantidad

    document
      .getElementById(`eliminarItem-${item.id}`) // obtenemos el id del boton X
      .addEventListener("click", () => eliminaItem(item.id)); // añadimos un evento clic y llamamos a la funcion eliminaItem
  });

  /* agregamos un boton para poder vaciar el carrito si lo desae el usuario */
  const existenteVaciar = document.getElementById("btn-vaciar-interno"); // nuevo maca: evita duplicar el botón
  // si hay algo dentro de carrito y si no existe el voton vaciar
  if (carrito.length > 0 && !existenteVaciar) {
    const vaciar = document.createElement("button"); // creamos el boton
    vaciar.id = "btn-vaciar-interno"; // nuevo maca: le damos un id
    vaciar.classList.add("vaciar"); // le damos una clase
    vaciar.textContent = `Vaciar carrito`; // le añadimos texto
    carritoDiv.appendChild(vaciar); // añadimos vaciar como hijo de carritoDiv

    // ------------------------------------------------------------------------
    // nuevo maca: confirmación visual dentro del carrito (sin modal ni prompt)
    // nuevo matias: sacamos del evento la creacion del tag div para que no se duplique cada vez que se hace clic
  const confirmacion = document.createElement("div"); // creamos un div
  confirmacion.classList.add("confirmacion"); // le damos una clase
    vaciar.addEventListener("click", () => { // añadimos evento clic al boton vaciar
      confirmacion.innerHTML = `
        <p>Estas seguro que deseas viaciar el carrito.</p>
        <button id="confirmar-vaciar" class="btn-principal">Confirmar</button>
        <button id="cancelar-vaciar" class="btn-secundario">Cancelar</button>
      `; // en confirmacion insertamos por medio del metodo innerHTML un texto y dos botones
      carritoDiv.appendChild(confirmacion); // añadimos a confirmacion como hijo de carritoDiv
      
      document
        .getElementById("confirmar-vaciar") // obtenemos el id del boton confirmar
        .addEventListener("click", () => { // añadimos un evento clic al boton
          carrito.forEach((item) => { // recorremos carrito
            const libroOriginal = libros.find((l) => l.id === item.id); // obtenemos el objeto recorrido
            libroOriginal.stock += item.cantidad; // devolvemos el stock al array original
          });
          carrito.length = 0; // dejamos vacio el carrito
          carritoContainer.classList.toggle("oculto"); // nuevo matias: oculta el carrito al vaciarlo
          guardarCarritoLS(); // Agregado para cambiar el estado del carrito con LS
          mostrarCarrito(); // actualizamos la vista del carrito
          mostrarLibros(); // mostramos nuevamente libros para que sea visible la devolucion del stock
          actualizarContador(); // actualizamos el contador
        });

      document
        .getElementById("cancelar-vaciar") // obtenemos el id del boton cancelar
        .addEventListener("click", () => { // añadimos un evento clic al boton
          confirmacion.remove(); // eliminamos el div confirmacion
        });
    });
  
  }

  /* sacamos la cuenta del total con el metodo reduce */
  const total = carrito.reduce((acc, l) => acc + l.subtotal, 0);
  /* cargamos el total como texto de totalDiv */
  if (totalDiv) { // si existe el div llamado totalDiv
    if (total > 0) { // y el total es mayor a 0
      totalDiv.textContent = `Total: $${total}`; // añadimos a total como contenido de totalDiv por medio del metodo textContent
    } else {
      totalDiv.textContent = ""; // si no, dejamos vacio el div de totalDiv
    }
  }

  actualizarContador(); // nuevo maca: asegura que el ícono refleje la cantidad actual
}

/* creamos la funcion para restar cantidad a cada item*/
function restaCantidad(id) { // recibimos un id como parametro
  const item = carrito.find((l) => l.id === id); // busacamos el item en carrito
  const libroOriginal = libros.find((l) => l.id === id); // buscamos el item en el array original
  if (item.cantidad >= 1) { // si la cantidad del item en el carrito es mayor a 0
    item.cantidad--; // restamos uno a la cantidad
    libroOriginal.stock++; // sumamos uno al stock
    item.subtotal = item.cantidad * item.precio; // calculamos nuevamente el subtotal
  } else { // si la cantidad del item en el carrito llega a 0
    const index = carrito.findIndex((l) => l.id === id); // obtenemos el indice del item
    carrito.splice(index, 1); // eliminamos el item del carrito con el indice obtenido
  }
  // nuevo matias: oculta carrito si se eliminan todos los items
  if(carrito.length === 0){
    carritoContainer.classList.toggle("oculto"); // oculta carritoContainer
  }

  mostrarLibros();
  mostrarCarrito();
  actualizarContador(); // nuevo maca
  guardarCarritoLS(); //nuevo paul para LS
}

/* creamos la funcion para sumar cantidad a cada item*/
function sumaCantidad(id) { // recibimos un id como parametro
  const item = carrito.find((l) => l.id === id); // busacamos el item en carrito
  const libroOriginal = libros.find((l) => l.id === id); // buscamos el item en el array original

  if (libroOriginal.stock > 0) { // si el stock del item en el array es mayor a 0
    item.cantidad++; // sumamos uno a la cantidad
    libroOriginal.stock--; // restamos uno al stock
    item.subtotal = item.cantidad * item.precio; // calculamos nuevamente el subtotal
  } else { // si el stock del item en el array llega a 0
    alert("Libro sin stock disponible"); // avisamos al usuario que no hay stock
    return; // y salimos de la funcion
  }

  mostrarCarrito();
  mostrarLibros();
  actualizarContador(); // nuevo maca
  guardarCarritoLS(); //nuevo paul para LS
}

/* creamos la funcion para sumar cantidad a cada item*/
function eliminaItem(id) { // recibimos un id como parametro
  const item = carrito.find((l) => l.id === id); // busacamos el item en carrito
  const libroOriginal = libros.find((l) => l.id === id); // buscamos el item en el array original
  const index = carrito.findIndex((l) => l.id === id); // obtenemos el indice del item en el carrito

  if (item) { // si se encontro el item
    libroOriginal.stock += item.cantidad; // sumamos la cantidad del item al stock del array original
    carrito.splice(index, 1); // gracias al indice obtenido eliminamos del carrito el indice 
  }

  // nuevo matias: oculta carrito si se eliminan todos los items
  if(carrito.length === 0){
    carritoContainer.classList.toggle("oculto"); // oculta carritoContainer
  }

  mostrarCarrito();
  mostrarLibros();
  actualizarContador(); // ya estaba en tu versión al final, lo conservamos
  guardarCarritoLS(); //nuevo paul para LS
}

//--------------------------------------------------------------- ICono Carrito ------------------------------------------------------------------

  iconoCarrito.addEventListener("click", () => { // añade evento click al icono del carrito
    // nuevo maca: protector por si no existe
    carritoContainer.classList.toggle("oculto"); // nuevo maca: muestra/oculta el mini carrito
  });

  /* creamos una funcion para el contador del carrito */
function actualizarContador() {
  const contador = document.getElementById("contador-carrito"); // obtenemos el contador desde el HTML por su id
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0); // cuenta los items del carrito
  // nuevo matias: verificamos si totalItems es mayor a 0
  if (totalItems > 0) {
    contador.style.display = "block"; // nuevo matias: si es verdadero se muestra contador
  } else {
    contador.style.display = "none"; // nuevo matias: si es falso se oculta contador
  }
  if (contador) contador.textContent = totalItems; // nuevo maca: protector
}

//------------------------ Ajustamos el stock del catálogo con el carrito persistente  LS---
// funciona al cargar la pagina
carrito.forEach((item) => {// recorremos el carrito (persistente) 
  const libroOriginal = libros.find((l) => l.id === item.id); // buscamos los libros que coinciden con los items
  if (libroOriginal) { // si hay cincidencia
    // Disminuir el stock original por la cantidad que está en el carrito persistente
    libroOriginal.stock -= item.cantidad; 
  }
});

// nuevo maca: inicializamos de forma segura para que funcione en todas las páginas
if (listaLibros) { // si existe algo cargado en el catalogo
  mostrarLibros(); // llamamos a la funcion para mostrar en el catalogo
} // ahora muestra el stock corregido
mostrarCarrito(); // nuevo maca: pinta el carrito (si existe el contenedor)
actualizarContador(); // nuevo maca: inicia el contador en 0
