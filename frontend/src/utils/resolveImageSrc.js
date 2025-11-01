// Utility to resolve image src for profile pictures.
// Handles: blob previews, absolute URLs, relative upload paths, and local assets.
const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

export default function resolveImageSrc(pic, fallback = '') {
  if (!pic) return fallback;
  if (typeof pic !== 'string') return fallback;
  // Local preview (File/URL.createObjectURL)
  if (pic.startsWith('blob:')) return pic;
  // Absolute URL
  if (/^http?:\/\//.test(pic)) return pic;
  // Leading slash: likely an uploads path like `/uploads/...` or an absolute asset path.
  if (pic.startsWith('/')) return BACKEND ? `${BACKEND}${pic}` : pic;
  // Other relative/imported paths (e.g. Vite-processed asset imports)
  return pic;
}
