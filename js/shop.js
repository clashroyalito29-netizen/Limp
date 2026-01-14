/**
 * Lógica de Carrito y Ventas - LimpiezaYa
 */

// 1. Estado Global del Carrito
let cart = JSON.parse(localStorage.getItem('cart_limpieza')) || [];

// 2. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupCartListeners();
});

// 3. Configurar Eventos
function setupCartListeners() {
    // Abrir/Cerrar Carrito
    const cartBtn = document.getElementById('cart-toggle');
    const closeCart = document.querySelector('#cart-drawer .btn-close');
    const cartDrawer = document.getElementById('cart-drawer');

    if (cartBtn) {
        cartBtn.addEventListener('click', () => cartDrawer.classList.add('active'));
    }
    if (closeCart) {
        closeCart.addEventListener('click', () => cartDrawer.classList.remove('active'));
    }

    // Escuchar clicks en botones de "Agregar" (Delegación de eventos para productos dinámicos)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-item')) {
            const card = e.target.closest('.product-card');
            const product = {
                id: card.dataset.id,
                name: card.querySelector('.p-name').innerText,
                price: parseFloat(card.querySelector('.p-price').innerText.replace('$', '')),
                img: card.querySelector('img').src,
                qty: 1
            };
            addToCart(product);
        }
    });
}

// 4. Agregar al Carrito
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push(product);
    }

    saveAndRefresh();
    
    // Pequeña animación visual al icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('pulse-anim');
    setTimeout(() => cartIcon.classList.remove('pulse-anim'), 500);
}

// 5. Guardar y Refrescar
function saveAndRefresh() {
    localStorage.setItem('cart_limpieza', JSON.stringify(cart));
    updateCartUI();
}

// 6. Actualizar Interfaz del Carrito
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Actualizar contador del Nav
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.innerText = totalItems;

    // Limpiar y Dibujar items
    cartItemsContainer.innerHTML = '';
    let totalMoney = 0;

    cart.forEach((item, index) => {
        totalMoney += item.price * item.qty;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" width="50">
                <div class="item-info">
                    <p>${item.name}</p>
                    <span>${item.qty}x $${item.price}</span>
                </div>
                <button onclick="removeFromCart(${index})" class="btn-remove">🗑️</button>
            </div>
        `;
    });

    cartTotal.innerText = `$${totalMoney.toFixed(2)}`;
}

// 7. Eliminar item
window.removeFromCart = (index) => {
    cart.splice(index, 1);
    saveAndRefresh();
};
