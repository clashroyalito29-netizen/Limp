// 1. Efecto de Scroll en el Nav
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// 2. Lógica del Buscador
const searchInput = document.getElementById('main-search');
const categoryFilter = document.getElementById('filter-category');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const category = categoryFilter.value;
    
    // Aquí es donde filtrarás los productos que vienen de Supabase
    console.log(`Buscando: ${query} en categoría: ${category}`);
    
    // Podemos disparar una animación de "escaneando" en la grilla
    filterProducts(query, category);
});

// Función ejemplo para filtrar (se completará con Supabase)
function filterProducts(query, category) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const cardCategory = card.dataset.category;
        
        const matchesQuery = title.includes(query);
        const matchesCategory = category === 'all' || cardCategory === category;
        
        if (matchesQuery && matchesCategory) {
            card.style.display = 'block';
            card.classList.add('animate-in'); // Animación de re-entrada
        } else {
            card.style.display = 'none';
        }
    });
}

