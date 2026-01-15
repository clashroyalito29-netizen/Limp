/**
 * Lógica de Carrito y Botella Interactiva
 * Manuel Cardenas - Pico Truncado
 */

let cart = JSON.parse(localStorage.getItem('limpieza_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupBottleLogic();
});

// --- SECCIÓN BOTELLA INTERACTIVA ---
function setupBottleLogic() {
    const range = document.getElementById('liters-range');
    const liquid = document.querySelector('.liquid-bg');
    const displayLiters = document.getElementById('display-liters');
    const displayPrice = document.getElementById('display-price');
    const btnAddBulk = document.querySelector('.btn-add-bulk');

    const PRICE_PER_LITER = 1500; // Podés traerlo de Supabase luego

    if(!range) return;

    range.addEventListener('input', (e) => {
        const liters = e.target.value;
        const total = liters * PRICE_PER_LITER;
        
        // Animamos la botella
        liquid.style.height = (liters * 20) + "%"; // 5L = 100%
        displayLiters.innerText = liters + "L";
        displayPrice.innerText = "$" + total;
    });

    btnAddBulk.addEventListener('click', () => {
        const liters = range.value;
        const item = {
            id: 'bulk-' + Date.now(),
            name: `Jabón Suelto (${liters}L)`,
            price: liters * PRICE_PER_LITER,
            img: 'img/bottle-icon.png',
            qty: 1
        };
        addToCart(item);
        alert(`¡Se agregaron ${liters}L al carrito!`);
    });
}

// --- LÓGICA DEL CARRITO ---
function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push(product);
    }
    saveCart();
}

function saveCart() {
    localStorage.setItem('limpieza_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const count = document.getElementById('cart-count');
    const totalElement = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    if(count) count.innerText = totalItems;
    if(totalElement) totalElement.innerText = "$" + totalPrice;
}

// Botón de WhatsApp - Finalizar Compra
document.querySelector('.btn-checkout')?.addEventListener('click', () => {
    let message = "Hola LimpiezaYa! Quiero pedir:\n";
    cart.forEach(i => {
        message += `- ${i.name} x${i.qty} ($${i.price * i.qty})\n`;
    });
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    message += `*Total: $${total}*`;
    
    window.open(`https://wa.me/2975373508?text=${encodeURIComponent(message)}`);
});
