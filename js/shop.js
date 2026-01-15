/**
 * shop.js - Lógica de Carrito y Botella Interactiva
 * Manuel Cardenas | Pico Truncado
 */

let cart = JSON.parse(localStorage.getItem('limpieza_cart')) || [];
const PRICE_PER_LITER = 1500; // Podés cambiarlo según la lista de tu tía

document.addEventListener('DOMContentLoaded', () => {
    initBottleLogic();
    updateCartUI();
    setupCartToggle();
});

// --- 1. LÓGICA DE LA BOTELLA (Suelto) ---
function initBottleLogic() {
    const range = document.getElementById('liters-range');
    const chips = document.querySelectorAll('.btn-chip');
    const liquid = document.querySelector('.liquid-bg');
    const displayLiters = document.getElementById('display-liters');
    const displayPrice = document.getElementById('display-price');
    const btnAddBulk = document.querySelector('.btn-add-bulk');

    if (!range) return;

    // Función para actualizar visualmente la botella y precios
    const updateBottle = (liters) => {
        const total = (liters * PRICE_PER_LITER).toLocaleString('es-AR');
        
        // Animación del líquido (10L es el 100% de la botella)
        const percentage = (liters / 10) * 100;
        liquid.style.height = `${percentage}%`;
        
        // Actualizar textos evitando que se peguen
        displayLiters.innerText = `${liters}L`;
        displayPrice.innerText = `$${total}`;
        range.value = liters;
    };

    // Evento para los botones rápidos (1L, 2L, 5L)
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const lts = chip.dataset.liters;
            updateBottle(lts);
        });
    });

    // Evento para el slider (range)
    range.addEventListener('input', (e) => {
        updateBottle(e.target.value);
    });

    // Botón agregar al carrito
    btnAddBulk.addEventListener('click', () => {
        const liters = range.value;
        const item = {
            id: `bulk-${Date.now()}`,
            nombre: `Jabón Suelto (${liters}L)`,
            precio: liters * PRICE_PER_LITER,
            imagen_url: 'img/bottle-icon.png', // Asegurate que esta ruta exista
            cantidad: 1
        };
        addToCart(item);
        alert(`✅ ¡Se sumaron ${liters} litros!`);
    });
    
    // Inicializar en 1L
    updateBottle(1);
}

// --- 2. GESTIÓN DEL CARRITO ---
function addToCart(product) {
    // Si es un producto de catálogo, buscamos si ya existe por ID
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.cantidad++;
    } else {
        cart.push(product);
    }
    
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('limpieza_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems) return;

    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.precio * item.cantidad;
        count += item.cantidad;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <strong>${item.nombre}</strong>
                    <span>${item.cantidad} x $${item.precio}</span>
                </div>
                <button onclick="removeFromCart(${index})" class="btn-remove">✕</button>
            </div>
        `;
    });

    cartCount.innerText = count;
    cartTotal.innerText = `$${total.toLocaleString('es-AR')}`;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    saveAndRefresh();
};

// --- 3. WHATSAPP Y PANELES ---
function setupCartToggle() {
    const cartBtn = document.getElementById('cart-toggle');
    const cartDrawer = document.getElementById('cart-drawer');
    
    cartBtn?.addEventListener('click', () => {
        cartDrawer.classList.toggle('active');
    });

    // Finalizar compra por WhatsApp
    document.querySelector('.btn-checkout')?.addEventListener('click', () => {
        if (cart.length === 0) return alert("El carrito está vacío");

        let message = "¡Hola LimpiezaYa! 🧼 Quiero hacer este pedido:\n\n";
        let subtotal = 0;

        cart.forEach(item => {
            message += `• ${item.nombre} (x${item.cantidad}) - $${item.precio * item.cantidad}\n`;
            subtotal += item.precio * item.cantidad;
        });

        message += `\n*Total estimado: $${subtotal}*`;
        message += `\n📍 Entrega en Pico Truncado`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/2975373508?text=${encoded}`); // Tu número de contacto
    });
}
document.querySelector('.btn-mercadopago')?.addEventListener('click', () => {
    if (cart.length === 0) return alert("Carrito vacío");
    
    // Aquí podrías integrar la API de MP. Por ahora, redirigimos a tu link de cobro o enviamos mensaje.
    const total = document.getElementById('cart-total').innerText;
    alert(`Redirigiendo a Mercado Pago para abonar ${total}...`);
    // window.location.href = "TU_LINK_DE_PAGO_FIJO"; 
});
