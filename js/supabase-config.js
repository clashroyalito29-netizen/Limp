// js/supabase-config.js

const SUPABASE_URL = "https://eabpagvszxbxhzxiciyx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYnBhZ3ZzenhieGh6eGljaXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQxMjIsImV4cCI6MjA4NDAwMDEyMn0.O0ACM1pw1VQN-2WcEcqryWCCs7psW1MUF8T8CmHa9Io";

// 1. Verificamos si la librería existe
if (typeof supabase === 'undefined') {
    alert("🚨 ERROR: La librería de Supabase no cargó. Revisá el orden de tus scripts en el HTML.");
} else {
    // 2. Creamos la conexión
    var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 3. Prueba de fuego inmediata
    supabaseClient.from('productos').select('id').limit(1)
        .then(({ data, error }) => {
            if (error) alert("❌ ERROR DE SUPABASE:\n" + error.message);
        })
        .catch(err => alert("🚨 ERROR DE RED/SINTAXIS:\n" + err.message));
}

// Exportamos para que otros archivos lo usen
window.supabase = supabaseClient;
