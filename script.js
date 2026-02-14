/*********************************
 * ESTADO GLOBAL
 *********************************/
let productos = [];
let carrito = [];
let esAdmin = false;

/*********************************
 * ADMIN
 *********************************/
const ADMIN_EMAIL = "calisayamanuelnelsondavid@gmail.com";
let ADMIN_PASSWORD = "1234ca";

/*********************************
 * HELPERS
 *********************************/
const $ = (id) => document.getElementById(id);

/*********************************
 * DOM READY
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
    restaurarSesion();
    renderCatalogo();
    actualizarCarritoUI();
});

/*********************************
 * STORAGE
 *********************************/
function guardarDatos() {
    localStorage.setItem(
        "impacto3d_data",
        JSON.stringify({ productos, carrito, ADMIN_PASSWORD })
    );
}

function cargarDatos() {
    const data = JSON.parse(localStorage.getItem("impacto3d_data"));
    if (data) {
        productos = data.productos || [];
        carrito = data.carrito || [];
        ADMIN_PASSWORD = data.ADMIN_PASSWORD || ADMIN_PASSWORD;
    } else {
        productos = [
            {
                id: Date.now(),
                nombre: "Llaveros personalizados",
                precio: 1200,
                img: "https://i.imgur.com/z4d4kWk.jpeg",
                descripcion: "Llaveros impresos en 3D",
                categoria: "Accesorios"
            },
            {
                id: Date.now() + 1,
                nombre: "Mate 3D",
                precio: 7000,
                img: "https://i.imgur.com/nhJmCkN.jpeg",
                descripcion: "Mate impreso en 3D",
                categoria: "Mates"
            }
        ];
        guardarDatos();
    }
}

/*********************************
 * RESTAURAR SESIÓN (SEGURO)
 *********************************/
function restaurarSesion() {
    if (localStorage.getItem("impacto3d_admin_logueado") === "true") {
        esAdmin = true;
        ocultarPublico();
        mostrarAdmin();
    }
}

/*********************************
 * ELEMENTOS
 *********************************/
const menuBtn = $("menuBtn");
const dropdownMenu = $("dropdownMenu");

const loginBtn = $("loginBtn");
const registerBtn = $("registerBtn");
const logoutBtn = $("logoutBtn");

const loginModal = $("loginModal");
const loginSubmitBtn = $("loginSubmitBtn");

const cartBtn = $("cartBtn");
const cartModal = $("cartModal");
const cartCount = $("cartCount");

const adminPanelBtn = $("adminPanelBtn");
const adminModal = $("adminModal");
const adminProductList = $("adminProductList");

const catalog = $("catalog");

/*********************************
 * MENÚ
 *********************************/
if (menuBtn && dropdownMenu) {
    menuBtn.onclick = () => dropdownMenu.classList.toggle("hidden");

    document.addEventListener("click", (e) => {
        if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add("hidden");
        }
    });
}

/*********************************
 * LOGIN
 *********************************/
if (loginBtn && loginModal) {
    loginBtn.onclick = () => {
        loginModal.classList.remove("hidden");
        dropdownMenu?.classList.add("hidden");
    };
}

if (loginSubmitBtn) {
    loginSubmitBtn.onclick = () => {
        const email = $("loginEmail")?.value;
        const pass = $("loginPassword")?.value;

        if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
            esAdmin = true;
            localStorage.setItem("impacto3d_admin_logueado", "true");

            // cerrar todos los modales
            document.querySelectorAll(".modal").forEach(m =>
                m.classList.add("hidden")
            );

            ocultarPublico();
            mostrarAdmin();

            if ($("loginEmail")) $("loginEmail").value = "";
            if ($("loginPassword")) $("loginPassword").value = "";

            alert("Sesión iniciada correctamente");
        } else {
            alert("Correo o contraseña incorrectos");
        }
    };
}

/*********************************
 * LOGOUT
 *********************************/
if (logoutBtn) {
    logoutBtn.onclick = () => {
        esAdmin = false;
        localStorage.removeItem("impacto3d_admin_logueado");

        mostrarPublico();
        adminModal?.classList.add("hidden");

        alert("Sesión cerrada");
    };
}

/*********************************
 * VISIBILIDAD (BLINDADA)
 *********************************/
function mostrarAdmin() {
    if (adminPanelBtn) adminPanelBtn.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
}

function ocultarPublico() {
    if (loginBtn) loginBtn.classList.add("hidden");
    if (registerBtn) registerBtn.classList.add("hidden");
}

function mostrarPublico() {
    if (loginBtn) loginBtn.classList.remove("hidden");
    if (registerBtn) registerBtn.classList.remove("hidden");
    if (adminPanelBtn) adminPanelBtn.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
}

/*********************************
 * CATÁLOGO
 *********************************/
function renderCatalogo() {
    if (!catalog) return;
    catalog.innerHTML = "";

    productos.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.img}" class="product-img">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <strong>$${p.precio}</strong>
        `;
        card.onclick = () => agregarAlCarrito(p.id);
        catalog.appendChild(card);
    });
}

/*********************************
 * CARRITO
 *********************************/
function agregarAlCarrito(id) {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    const existe = carrito.find(i => i.id === id);
    existe ? existe.cantidad++ : carrito.push({ ...prod, cantidad: 1 });

    guardarDatos();
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    if (cartCount) cartCount.textContent = carrito.length;
}

if (cartBtn && cartModal) {
    cartBtn.onclick = () => {
        cartModal.classList.remove("hidden");
        mostrarCarrito();
    };
}

function mostrarCarrito() {
    const cartItems = $("cartItems");
    const cartTotal = $("cartTotal");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        cartItems.innerHTML += `<div>${item.nombre} x${item.cantidad}</div>`;
    });

    cartTotal.textContent = total;
}

/*********************************
 * PANEL ADMIN
 *********************************/
if (adminPanelBtn && adminModal) {
    adminPanelBtn.onclick = () => {
        if (!esAdmin) return;

        document.querySelectorAll(".modal").forEach(m =>
            m.classList.add("hidden")
        );

        adminModal.classList.remove("hidden");
        renderAdminProductos();
    };
}

function renderAdminProductos() {
    if (!adminProductList) return;

    adminProductList.innerHTML = "";

    if (productos.length === 0) {
        adminProductList.innerHTML = "<p>No hay productos</p>";
        return;
    }

    productos.forEach(p => {
        const row = document.createElement("div");
        row.className = "admin-row";
        row.innerHTML = `
            <span>${p.nombre}</span>
            <span>${p.categoria}</span>
            <span>$${p.precio}</span>
            <button onclick="eliminarProductoAdmin(${p.id})">
                Eliminar
            </button>
        `;
        adminProductList.appendChild(row);
    });
}

function eliminarProductoAdmin(id) {
    if (!confirm("¿Eliminar producto?")) return;
    productos = productos.filter(p => p.id !== id);
    guardarDatos();
    renderCatalogo();
    renderAdminProductos();
}

/*********************************
 * CERRAR MODALES
 *********************************/
document.querySelectorAll(".close-modal").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".modal").forEach(m =>
            m.classList.add("hidden")
        );
    };
});

