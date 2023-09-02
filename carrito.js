let inputName = document.getElementById("nombre");
let inputPrice = document.getElementById("precio");
let inputStock = document.getElementById("stock");

let botonCreate = document.getElementById("btn-create-product");

let cards = document.getElementById("productos");
let contId = 0;
let productosCargados = load("productos") ? load("productos") : []; //ternario, para cargar los productos
let productos = [];
if(localStorage.getItem("img")){
  document.getElementById("avatar").setAttribute("src", localStorage.getItem("img"))
}
class Producto {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = parseFloat(precio);
    this.stock = parseInt(stock);
    this.id = contId++;
  }
  restaStock() {
    if (this.stock - 1 >= 0) {
      this.stock = this.stock - 1;
    }
    return this.stock;
  }
  sumaStock() {
    this.stock = this.stock + 1;
    return this.stock;
  }
}
productosCargados.map((p) => {
  p.id = undefined;
  cargarStock(p);
});
botonCreate.addEventListener("click", (e) => {
  if (
    nombre.value.length == 0 ||
    precio.value.length == 0 ||
    stock.value.length == 0
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No agregaste ningun producto!",
    });
  } else {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Se agrego el producto correctamente",
      showConfirmButton: false,
      timer: 1500,
    });
    cargarStock({
      nombre: inputName.value,
      precio: inputPrice.value,
      stock: inputStock.value,
    });
    save("productos", productos);
  }
  inputName.value = "";
  inputPrice.value = "";
  inputStock.value = "";
});
function cargarStock(prod) {
  let p = new Producto(prod.nombre, prod.precio, prod.stock);
  productos.push(p);
  cards.innerHTML =
    cards.innerHTML +
    `<div class="producto" id="p${p.id}">

  <h3 class="titulo">${p.nombre}</h3>
  <span class="precio">Precio: ${p.precio}</span>
  <span class="stock">Stock: ${p.stock}</span>
  <div class="stockOptions">
    <button onclick="sumarStock(${p.id})">+</button>
    <button onclick="restarStock(${p.id})">-</button>
  </div>
  <button class="btnRemove" onclick="remove(${p.id})">X</button>
  
  </div>`;
}
function sumarStock(id) {
  let m = productos.filter((p) => p.id == id)[0];
  let pDom = document.getElementById(`p${id}`);
  pDom.children.item(2).innerHTML = `Stock: ${m.sumaStock()}`;
  save("productos", productos);
}
function restarStock(id) {
  let m = productos.filter((p) => p.id == id)[0];
  let pDom = document.getElementById(`p${id}`);
  pDom.children.item(2).innerHTML = `Stock: ${m.restaStock()}`;
  save("productos", productos);
}
function remove(id) {
  Swal.fire({
    title: "Estas seguro que queres eliminar el producto?",
    text: "No se va a revertir el cambio!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
   
  }).then((result) => {
    if (result.isConfirmed) {
      productos = productos.filter((p) => p.id != id);
      document.getElementById(`p${id}`).remove();
      save("productos", productos);
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
  save("productos", productos);
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function load(key) {
  return JSON.parse(localStorage.getItem(key));
}
function validarFormulario() {
  if (nombre === "" || precio === "" || stock === "") {
    alert("Por favor, completa todos los campos.");
    return false;
  }
}



fetch('https://rickandmortyapi.com/api/character')
  .then((resp) => resp.json())
  .then((data) => {
    data.results.map((p, index) => {
      document.getElementById("imgs").innerHTML+= `<img onclick="selectImg(${index})" src="${p.image}">` 

    }) 
  } )
let btnToggle = document.getElementById("toggle-imgs")
btnToggle.addEventListener("click", e => {
  let imgs = document.getElementById("imgs")
  imgs.classList.toggle("hidden")

})
function selectImg(index){
  fetch(`https://rickandmortyapi.com/api/character/${index+1}`)
  .then((resp) => resp.json())
  .then((data) => {
    document.getElementById("avatar").setAttribute("src", data.image)
    localStorage.setItem("img", data.image)
  })
}