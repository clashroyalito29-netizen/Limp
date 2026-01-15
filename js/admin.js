/**
 * admin.js - Parte 1: Seguridad y Sesión
 * Manuel Cardenas - Full Stack Dev
 */

// 1. VERIFICAR SESIÓN AL CARGAR
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // Si no hay sesión, mostramos solo el login
        document.getElementById('admin-content').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    } else {
        // Si hay sesión, cargamos el panel
        showAdminPanel();
    }
});

// 2. LÓGICA DE LOGIN
async function handleLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Error de acceso: " + error.message);
    } else {
        location.reload(); // Recargamos para mostrar el panel
    }
}

// 3. CERRAR SESIÓN
async function handleLogout() {
    await supabase.auth.signOut();
    location.reload();
}

// Vinculamos el botón de logout (asegurate que el ID coincida en tu HTML)
document.getElementById('btn-logout')?.addEventListener('click', handleLogout);
/**
 * admin.js - Parte 2: CRUD de Productos
 */

async function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    await loadAdminProducts();
}

async function loadAdminProducts() {
    const listContainer = document.getElementById('admin-product-list');
    listContainer.innerHTML = '<p>Cargando gestión...</p>';

    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return;

    listContainer.innerHTML = '';
    data.forEach(p => {
        listContainer.innerHTML += `
            <div class="admin-item-card">
                <img src="${p.imagen_url}" width="50">
                <div class="info">
                    <strong>${p.nombre}</strong>
                    <span>$${p.precio} - ${p.categoria}</span>
                </div>
                <div class="actions">
                    <button onclick="deleteProduct('${p.id}', '${p.imagen_url}')" class="btn-del">🗑️</button>
                </div>
            </div>
        `;
    });
}

// LÓGICA PARA BORRAR
window.deleteProduct = async (id, imageUrl) => {
    if (!confirm("¿Segura que querés borrar este producto?")) return;

    // 1. Borrar de la tabla
    const { error: tableError } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

    if (tableError) {
        alert("Error al borrar datos");
        return;
    }

    // 2. Intentar borrar la imagen del Storage (opcional pero prolijo)
    const fileName = imageUrl.split('/').pop();
    await supabase.storage.from('productos').remove([fileName]);

    alert("Producto eliminado");
    loadAdminProducts();
};
/**
 * admin.js - Parte 3: Formulario de Carga y Compresión
 */

const adminForm = document.getElementById('product-form');

if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btnSubmit = adminForm.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Procesando...";

        const file = document.getElementById('p-image').files[0];
        const nombre = document.getElementById('p-name').value;
        const precio = document.getElementById('p-price').value;
        const categoria = document.getElementById('p-category').value;

        try {
            let finalImageUrl = "";

            if (file) {
                // 1. COMPRESIÓN DE IMAGEN (API browser-image-compression)
                const options = {
                    maxSizeMB: 0.7, // Menos de 1MB para que vuele en el celular
                    maxWidthOrHeight: 1024,
                    useWebWorker: true
                };
                
                console.log("Comprimiendo imagen...");
                const compressedFile = await imageCompression(file, options);

                // 2. SUBIDA AL STORAGE DE SUPABASE
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('productos') // Asegurate de que el bucket sea público
                    .upload(filePath, compressedFile);

                if (uploadError) throw uploadError;

                // Obtenemos la URL pública
                const { data: urlData } = supabase.storage
                    .from('productos')
                    .getPublicUrl(filePath);
                
                finalImageUrl = urlData.publicUrl;
            }

            // 3. INSERTAR EN LA BASE DE DATOS
            const { error: insertError } = await supabase
                .from('productos')
                .insert([{
                    nombre: nombre,
                    precio: parseFloat(precio),
                    categoria: categoria,
                    imagen_url: finalImageUrl,
                    stock: 0
                }]);

            if (insertError) throw insertError;

            alert("✅ ¡Producto cargado con éxito!");
            adminForm.reset();
            loadAdminProducts(); // Refrescamos la lista de abajo

        } catch (err) {
            alert("❌ Error: " + err.message);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Cargar Producto";
        }
    });
}
