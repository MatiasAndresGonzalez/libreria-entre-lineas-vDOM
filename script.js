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

const listaLibros = document.getElementById("lista-libros");
const carritoDiv = document.getElementById("carrito");
const totalDiv = document.getElementById("total");
const carrito = [];

// Mostrar catálogo
function mostrarLibros() {
  /* limpiamos la lista */
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
}

// mostramos carrito
function mostrarCarrito() {
  /* iniciamos el carrito en blanco */
  carritoDiv.innerHTML = "";

  /* recorremos carrito y agregamos lo que vamos a mostrar */
  carrito.forEach((item) => {
    /* creamos nuevo elemento "div" y le damos una clase */
    const titulo = document.createElement("div");
    titulo.classList.add("titulo");

    titulo.innerHTML = `<b>${item.titulo}</b> <button id="disminuye-${item.id}" class="resta">-</button> x${item.cantidad} <button id="aumenta-${item.id}" class="suma">+</button> - Subtotal: $${item.subtotal} <button id="eliminarItem-${item.id}" class="rojo">X</button>`;

    /* agregamos el titulo como hijo del carritoDiv */
    carritoDiv.appendChild(titulo);

    document
      .getElementById(`disminuye-${item.id}`)
      .addEventListener("click", () => restaCantidad(item.id));

    document
      .getElementById(`aumenta-${item.id}`)
      .addEventListener("click", () => sumaCantidad(item.id));

    document
      .getElementById(`eliminarItem-${item.id}`)
      .addEventListener("click", () => eliminaItem(item.id));
  });

  /* agregamos un boton para poder vaciar el carrito si lo desae el usuario */
  if (carrito.length > 0) {
    const vaciar = document.createElement("button");
    vaciar.classList.add("vaciar");
    /* agregamos el texto del boton */
    vaciar.textContent = `Vaciar carrito`;
    /* agregamos el boton como hijo de carritoDiv */
    carritoDiv.appendChild(vaciar);

    vaciar.addEventListener("click", () => {
      let alertaVaciar = prompt(`si desea borrar el carrito presione S`)
        .trim()
        .toLowerCase();

      while (alertaVaciar.trim().toLowerCase() !== "s") {
        alertaVaciar = prompt(
          `si desea borrar el carrito presione S`
        ).toLowerCase();

        if (alertaVaciar === null) return;
      }

      carrito.forEach((item) => {
        const libroOriginal = libros.find((l) => l.id === item.id);
        libroOriginal.stock += item.cantidad;
      });

      carrito.length = 0;
      mostrarCarrito();
      mostrarLibros();
    });
  }

  /* sacamos la cuenta del total con el metodo reduce */

  const total = carrito.reduce((acc, l) => acc + l.subtotal, 0);
  /* cargamos el total como texto de totalDiv */
  if (total > 0) {
    totalDiv.textContent = `Total: $${total}`;
  } else {
    totalDiv.textContent = "";
  }
}

function restaCantidad(id) {
  const item = carrito.find((l) => l.id === id);
  const libroOriginal = libros.find((l) => l.id === id);
  if (item.cantidad >= 1) {
    item.cantidad--;
    libroOriginal.stock++;
    item.subtotal = item.cantidad * item.precio;
  } else {
    const index = carrito.findIndex((l) => l.id === id);
    carrito.splice(index, 1);
  }

  mostrarLibros();
  mostrarCarrito();
}

function sumaCantidad(id) {
  const item = carrito.find((l) => l.id === id);
  const libroOriginal = libros.find((l) => l.id === id);

  if (libroOriginal.stock > 0) {
    item.cantidad++;
    libroOriginal.stock--;
    item.subtotal = item.cantidad * item.precio;
  } else {
    alert("Libro sin stock disponible");
    return;
  }

  mostrarCarrito();
  mostrarLibros();
}

function eliminaItem(id) {
  const item = carrito.find((l) => l.id === id);
  const libroOriginal = libros.find((l) => l.id === id);
  const index = carrito.findIndex((l) => l.id === id);

  if (item) {
    libroOriginal.stock += item.cantidad;
    carrito.splice(index, 1);
  }

  mostrarCarrito();
  mostrarLibros();
}

mostrarLibros();
