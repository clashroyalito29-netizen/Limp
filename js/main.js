/**
 * main.js - Cerebro de LimpiezaYa
 * Manuel Cardenas - Full Stack Dev
 */

let allProducts = [];

// 1. INICIO DE LA APP
async function initApp() {
    console.log("🚀 Iniciando tienda...");
    await loadProducts();
    setupCategoryFilters();
    setupSearchBar();
}

// 2. CARGA DE PRODUCTOS DESDE SUPABASE
async function loadProducts() {
    const grid = document.getElementById('product-grid');
    
    // Mostramos Skeletons mientras carga (UX Pro)
    grid.innerHTML = '<div class="skeleton"></div>'.repeat(6);

    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allProducts = data;
        renderGallery(allProducts);

    } catch (err) {
        console.error("Error en Supabase:", err.message);
        grid.innerHTML = `<p class="error-msg">Error al cargar productos. Reintenta.</p>`;
    }
}

// 3. RENDERIZADO DINÁMICO (2-3 por fila)
function renderGallery(products) {
    const grid = document.getElementById('product-grid');
    const template = document.getElementById('card-template');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p class="empty-msg">No hay productos en esta sección.</p>';
        return;
    }

    products.forEach(item => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.product-card');
        
        // Datos
        card.dataset.id = item.id;
        card.dataset.category = item.categoria;
        clone.querySelector('.p-name').innerText = item.nombre;
        clone.querySelector('.p-price').innerText = `$${item.precio}`;
        
        // Imagen con Lazy Load
        const img = clone.querySelector('img');
        img.src = item.imagen_url || 'img/default-clean.png';
        img.loading = "lazy"; 

        // Efecto Fade-In al entrar en pantalla
        card.classList.add('fade-up');
        grid.appendChild(clone);
    });

    // Activamos el Intersection Observer
    applyScrollReveal();
}

// 4. FILTROS Y BÚSQUEDA
function setupCategoryFilters() {
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const cat = btn.dataset.category;
            const filtered = cat === 'todos' ? allProducts : allProducts.filter(p => p.categoria === cat);
            renderGallery(filtered);
        });
    });
}

function setupSearchBar() {
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.nombre.toLowerCase().includes(term));
        renderGallery(filtered);
    });
}

// 5. ANIMACIÓN DE ENTRADA (Scroll Reveal)
function applyScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
}

document.addEventListener('DOMContentLoaded', initApp);
/**
 * main.js - Parte Final
 */

function setupInteractions() {
    // 1. Lógica de Menú Hamburguesa
    const menuBtn = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const sideMenu = document.getElementById('side-menu');

    menuBtn?.addEventListener('click', () => sideMenu.classList.add('active'));
    closeMenu?.addEventListener('click', () => sideMenu.classList.remove('active'));

    // 2. Lógica de Cierre de Carrito
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');

    closeCart?.addEventListener('click', () => cartDrawer.classList.remove('active'));

    // 3. Conectar Catálogo con Carrito
    document.getElementById('product-grid').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const card = e.target.closest('.product-card');
            const product = {
                id: card.dataset.id,
                nombre: card.querySelector('.p-name').innerText,
                precio: parseFloat(card.querySelector('.p-price').innerText.replace('$', '')),
                cantidad: 1
            };
            addToCart(product); // Llama a la función de shop.js
        }
    });
}

document.addEventListener('DOMContentLoaded', setupInteractions);

