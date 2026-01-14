
async function fetchProducts() {
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error cargando productos:", error);
        return;
    }

    renderProducts(data);
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    const template = document.getElementById('card-template');

    // Limpiamos los skeletons
    grid.innerHTML = '';

    products.forEach(product => {
        const clone = template.content.cloneNode(true);
        
        // Llenamos la tarjeta con los datos de Supabase
        clone.querySelector('.product-card').dataset.id = product.id;
        clone.querySelector('.p-name').innerText = product.nombre;
        clone.querySelector('.p-price').innerText = `$${product.precio}`;
        clone.querySelector('img').src = product.imagen_url || 'default.jpg';
        
        // Agregamos la clase de animación de entrada
        const card = clone.querySelector('.product-card');
        card.classList.add('fade-up');

        grid.appendChild(clone);
    });

    // Activamos las animaciones de entrada
    setupScrollReveal();
}

// Función para que los productos aparezcan al hacer scroll
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
}

document.addEventListener('DOMContentLoaded', fetchProducts);

const checkConnection = async () => {
    try {
        const { data, error } = await supabase.from('productos').select('id').limit(1);
        if (error) throw error;
        console.log("🚀 Supabase está operando correctamente en eabpagvszxbxhzxiciyx");
    } catch (err) {
        console.error("💀 Error crítico de Supabase:", err.message);
        alert("Tía, hay un problema con la base de datos: " + err.message);
    }
};

