let cartones = [];
let numerosCantados = [];
const history = [];

function limpiarTexto(texto) {
  return texto
    .split(/[\s,]+/)
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n));
}

function agregarCartones() {
  const nombre = document.getElementById("nombreCliente").value.trim();
  const letras = ["A", "B", "C", "D", "E", "F"];
  const datos = {};

  for (let l of letras) {
    const nums = limpiarTexto(document.getElementById(`carton${l}`).value);
    if (nums.length !== 15) {
      alert(`Cartón ${l} debe tener 15 números.`);
      return;
    }
    datos[l] = nums;
  }

  if (!nombre) {
    alert("Ingresa nombre del cliente.");
    return;
  }

  // Guardar estado para deshacer
  history.push(JSON.stringify({ cartones: [...cartones], numeros: [...numerosCantados] }));

  cartones.push({ nombre, ...datos });

  document.getElementById("nombreCliente").value = "";
  letras.forEach((l) => (document.getElementById(`carton${l}`).value = ""));

  renderizarCartones();
}

function cantarNumero() {
  const numeroInput = document.getElementById("numeroCantado");
  const numero = parseInt(numeroInput.value);

  if (!numero || numero < 1 || numero > 90) {
    alert("Ingresa un número válido entre 1 y 90.");
    return;
  }
  if (numerosCantados.includes(numero)) {
    alert("Número ya cantado.");
    numeroInput.value = "";
    return;
  }

  // Guardar estado para deshacer
  history.push(JSON.stringify({ cartones: [...cartones], numeros: [...numerosCantados] }));

  numerosCantados.push(numero);
  numeroInput.value = "";

  renderizarCantados();
  renderizarCartones();
}

function reiniciarJuego() {
  if (confirm("¿Reiniciar el juego?")) {
    cartones = [];
    numerosCantados = [];
    history.length = 0;
    document.getElementById("ventas").innerHTML = "";
    document.getElementById("numerosCantados").innerHTML = "";
  }
}

function undo() {
  if (history.length === 0) {
    alert("Nada para deshacer.");
    return;
  }
  const estadoPrevio = JSON.parse(history.pop());
  cartones = estadoPrevio.cartones;
  numerosCantados = estadoPrevio.numeros;
  renderizarCantados();
  renderizarCartones();
}

function renderizarCartones() {
  const contenedor = document.getElementById("ventas");
  contenedor.innerHTML = "";

  let huboGanadorNuevo = false;

  cartones.forEach((venta, i) => {
    const div = document.createElement("div");
    div.className = "venta";

    const cartonesHTML = ["A", "B", "C", "D", "E", "F"]
      .map((tipo) => {
        const carton = venta[tipo];
        const marcado = carton
          .map(
            (num) =>
              `<span class="${numerosCantados.includes(num) ? "marcado" : ""}">${num}</span>`
          )
          .join("");
        const esGanador = carton.every((num) => numerosCantados.includes(num));

        if (esGanador && !venta[`${tipo}_ganado`]) {
          venta[`${tipo}_ganado`] = true;
          huboGanadorNuevo = true;
        }

        return `
          <div class="carton ${esGanador ? "ganador-carton" : ""}" id="carton-${i}-${tipo}">
            <strong>Cartón ${tipo}:</strong>
            <div class="numeros">${marcado}</div>
            ${esGanador ? '<div class="ganador">🎉 ¡GANADOR!</div>' : ""}
          </div>`;
      })
      .join("");

    div.innerHTML = `<h3>🧾 Venta #${i + 1} - Cliente: <b>${venta.nombre}</b></h3>${cartonesHTML}`;
    contenedor.appendChild(div);
  });

  if (huboGanadorNuevo) {
    activarFlash();
  }
}

function renderizarCantados() {
  const cantadosDiv = document.getElementById("numerosCantados");
  cantadosDiv.innerHTML = numerosCantados
    .map((num) => `<span class="cantado">${num}</span>`)
    .join("");
}

function activarFlash() {
  const flash = document.getElementById("flash");
  flash.classList.add("active");

  setTimeout(() => {
    flash.classList.remove("active");
  }, 1200);
}

// Añadimos evento para agregar cartones automáticamente al llenar inputs
document.getElementById("nombreCliente").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    agregarCartones();
  }
});
