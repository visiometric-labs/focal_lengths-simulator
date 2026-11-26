/**
 * Utilidad universal para resolución de URLs de assets
 * Compatible con Vite dev, Vite build, GitHub Pages y rutas relativas
 */
export function getAssetUrl(path) {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // 1. Si Vite inyectó BASE_URL
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) {
      const base = import.meta.env.BASE_URL.replace(/\/$/, '');
      if (base) {
        return `${base}/${cleanPath}`;
      }
    }
  } catch (e) {
    // Entorno sin import.meta
  }

  // 2. Si corre directamente en GitHub Pages en el repositorio focal_lengths-simulator
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.pathname.includes('/focal_lengths-simulator')) {
      return `/focal_lengths-simulator/${cleanPath}`;
    }
  }

  // 3. Fallback relativo
  return `./${cleanPath}`;
}
