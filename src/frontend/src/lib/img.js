/* img.js — responsive image helpers.
 *
 * Project screenshots are pre-encoded into responsive WebP variants by
 * scripts/optimize-images.mjs. Data references the full-resolution file
 * (e.g. "/projects/p1/home.webp"); these helpers derive the smaller
 * candidates from that base so the browser downloads only the size it needs.
 *
 * WIDTHS must stay in sync with scripts/optimize-images.mjs.
 */

// Resized variants written as `<base>-<w>.webp`. The full file (`<base>.webp`)
// is the capture width (1440) and serves as the largest srcset candidate.
const WIDTHS = [480, 768, 1080];
const FULL_WIDTH = 1440;

// Strip the ".webp" (or legacy ".png") extension to get the variant base.
function baseOf(src) {
  return src.replace(/\.(webp|png|jpe?g)$/i, '');
}

/**
 * Build a srcset for a full-resolution image URL.
 *   srcSet("/projects/p1/home.webp")
 *   -> "/projects/p1/home-480.webp 480w, ... , /projects/p1/home.webp 1440w"
 */
export function srcSet(src) {
  if (!src) return undefined;
  const base = baseOf(src);
  const parts = WIDTHS.map((w) => `${base}-${w}.webp ${w}w`);
  parts.push(`${base}.webp ${FULL_WIDTH}w`);
  return parts.join(', ');
}

/**
 * `sizes` for a tile whose rendered width is roughly `desktopVw` of the
 * viewport on wide screens and full-width on phones. Capped at the capture
 * width so the browser never asks for a candidate larger than we have.
 */
export function sizes(desktopVw = 50) {
  return `(max-width: 820px) 92vw, ${desktopVw}vw`;
}
