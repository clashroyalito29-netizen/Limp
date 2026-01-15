/**
 * animations.js - Motor de efectos visuales
 * Manuel Cardenas | Full Stack Developer
 */

document.addEventListener('DOMContentLoaded', () => {
    initBubbles();
    initScrollReveal();
});

// --- 1. GENERADOR DE BURBUJAS DINÁMICAS ---
function initBubbles() {
    const container = document.getElementById('bubble-canvas-container');
    if (!container) return;

    // Función para crear una sola burbuja
    const createBubble = () => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // Tamaño aleatorio entre 10px y 40px
        const size = Math.random() * 30 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Posición horizontal aleatoria (0% a 100% del ancho)
        bubble.style.left = `${Math.random() * 100}%`;

        // Duración de la animación aleatoria para que no suban todas iguales
        const duration = Math.random() * 5 + 5; // Entre 5s y 10s
        bubble.style.animationDuration = `${duration}s`;

        // Opacidad aleatoria para dar profundidad
        bubble.style.opacity = Math.random() * 0.5 + 0.2;

        container.appendChild(bubble);

        // Limpieza: eliminamos la burbuja del DOM cuando termina la animación
        setTimeout(() => {
            bubble.remove();
        }, duration * 1000);
    };

    // Crear burbujas inicialmente
    for (let i = 0; i < 15; i++) {
        setTimeout(createBubble, Math.random() * 3000);
    }

    // Intervalo para seguir creando burbujas infinitamente
    setInterval(createBubble, 1500);
}

// --- 2. REVELADO AL HACER SCROLL (UX) ---
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Una vez que aparece, dejamos de observarlo para ahorrar recursos
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar secciones y tarjetas
    const elementsToReveal = document.querySelectorAll('.product-card, .soap-experience, .hero-container');
    elementsToReveal.forEach(el => {
        el.classList.add('fade-up'); // Clase base de animations.css
        observer.observe(el);
    });
}
