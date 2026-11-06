import axios from "axios";

const defaultBaseUrl = import.meta.env.DEV
  ? "http://127.0.0.1:5000"
  : window.location.origin;

// Em desenvolvimento, usa o backend local. Em produção, usa a mesma origem
// (o Flask serve o build do frontend). VITE_API_URL pode sobrescrever.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? defaultBaseUrl,
});

export default api;
