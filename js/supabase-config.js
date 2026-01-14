/**
 * Configuración de Conexión a Supabase
 * Proyecto: LimpiezaYa - Manuel Cardenas
 */

const SUPABASE_URL = "https://eabpagvszxbxhzxiciyx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYnBhZ3ZzenhieGh6eGljaXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQxMjIsImV4cCI6MjA4NDAwMDEyMn0.O0ACM1pw1VQN-2WcEcqryWCCs7psW1MUF8T8CmHa9Io";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("🔌 Conexión activa con el proyecto: eabpagvszxbxhzxiciyx");
