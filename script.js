const menu = document.querySelector(".fa-bars");
const ul = document.querySelector("ul");
const lis = document.querySelectorAll("li");

menu.addEventListener("click", () => {
  ul?.classList.toggle("animation");
});

lis.forEach((li) => {
  li.addEventListener("click", () => {
    ul?.classList.toggle("animation");
  });
});

////////////////////////////////////////////////////// clase molde productos

class BaseDeDatos {
  constructor() {
    this.productos = [];
    this.cargarRegistros();
  }

  async cargarRegistros() {
    const resultado = await fetch("JSON/productos.json");
    this.productos = await resultado.json();
    console.log(this.productos);
    cargarProductos(this.productos); // Llamamos a cargarProductos después de que los datos estén listos
  }

  traerRegistros() {
    return this.productos;
  }

  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  registrosPorCategoria(categoria) {
    return this.productos.filter((producto) => producto.categoria == categoria);
  }
}

const bd = new BaseDeDatos();

const divProductos = document.querySelector("#productos");
const btnCategorias = document.querySelectorAll(".btnCategorias");

btnCategorias.forEach((boton) => {
  boton.addEventListener("click", () => {
    const productos = bd.registrosPorCategoria(boton.dataset.categoria);
    cargarProductos(productos)
    console.log("funca");
  });
});

function cargarProductos(productos) {
  // Ordenar por precio ascendente
  productos.sort((a, b) => a.precio - b.precio);

  divProductos.innerHTML = `
    <div class="overlay"></div>
    <div class="zoom-view">
      <div class="close-btn">
        <i class="fa-solid fa-xmark"></i>
      </div>
      <img src="" alt="Zoom view" />
      <div class="zoom-info">
        <h3 class="zoom-title"></h3>
        <p class="zoom-medidas"></p>
      </div>
    </div>
  `;

  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="card">
        <div class="imgContainer">
          <img class="img" src="${producto.img}" alt="${producto.nombre}" />
        </div>
        <div class="infoContainer">
          <div class="nombreContainer">
            <h3>${producto.nombre}</h3>
          </div>
          <p class="medidas">${producto.medidas}</p>
          <p class="precio">$${producto.precio}</p>
        </div>
      </div>
    `;
  }

  setupZoomHandlers();
}


function setupZoomHandlers() {
  const images = document.querySelectorAll(".imgContainer img");
  const zoomView = document.querySelector(".zoom-view");
  const zoomImage = zoomView.querySelector("img");
  const zoomTitle = zoomView.querySelector(".zoom-title");
  const zoomMedidas = zoomView.querySelector(".zoom-medidas");
  const overlay = document.querySelector(".overlay");
  const closeBtn = document.querySelector(".close-btn");

  const openZoom = (imgSrc, title, medidas) => {
    zoomImage.src = imgSrc;
    zoomTitle.textContent = title;
    zoomMedidas.textContent = medidas;
    zoomView.style.display = "block";
    overlay.style.display = "block";
    void zoomView.offsetWidth;
    void overlay.offsetWidth;
    zoomView.classList.add("active");
    overlay.classList.add("active");
  };

  const closeZoom = () => {
    zoomView.classList.remove("active");
    overlay.classList.remove("active");
    setTimeout(() => {
      zoomView.style.display = "none";
      overlay.style.display = "none";
    }, 300);
  };

  images.forEach((img) => {
    const card = img.closest(".card");
    const title = card.querySelector("h3").textContent;
    const medidas = card.querySelector(".medidas").textContent;
    img.addEventListener("click", () => openZoom(img.src, title, medidas));
  });

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeZoom();
  });

  overlay.addEventListener("click", closeZoom);
  zoomView.addEventListener("click", closeZoom);
}
