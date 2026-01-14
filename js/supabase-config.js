/**
 * Configuración de Conexión a Supabase
 * Manuel Cardenas - Full Stack Dev
 */

// 1. Tus credenciales (Obtenelas en Project Settings > API)
const SUPABASE_URL = "https://tu-proyecto.supabase.co";
const SUPABASE_ANON_KEY = "tu-clave-anon-aqui";

// 2. Inicializar el cliente de Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("🔌 Conexión con Supabase establecida");

