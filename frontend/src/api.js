import axios from "axios";

// URL padrão para desenvolvimento local. Pode ser sobrescrita por
// VITE_API_URL no arquivo .env.local (veja .env.example).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000",
});

export default api;
