
/**
 * Motor de Animación de Burbujas - LimpiezaYa
 * Manuel Cardenas - Full Stack Dev
 */

function createBubbles() {
    const container = document.getElementById('bubble-canvas-container');
    
    // Configuramos una cantidad máxima para no saturar el celular de tu tía
    const bubbleCount = 15; 

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        // 1. Tamaño aleatorio entre 10px y 60px
        const size = Math.random() * 50 + 10 + 'px';
        bubble.style.width = size;
        bubble.style.height = size;

        // 2. Posición horizontal aleatoria (0% a 100%)
        bubble.style.left = Math.random() * 100 + '%';

        // 3. Retraso aleatorio para que no salgan todas juntas
        bubble.style.animationDelay = Math.random() * 8 + 's';

        // 4. Duración de la subida aleatoria (entre 6s y 12s)
        bubble.style.animationDuration = Math.random() * 6 + 6 + 's';

        // 5. Opacidad inicial aleatoria para dar profundidad
        bubble.style.opacity = Math.random() * 0.5;

        container.appendChild(bubble);
    }
}

// Inicializamos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    console.log("🫧 Burbujas activadas con éxito");
});
