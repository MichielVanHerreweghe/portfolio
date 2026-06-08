/**
 * generate-favicons.mjs — rasterize /public/favicon.svg into the PNG icon set
 * that Layout.astro and site.webmanifest reference.
 *
 * The SVG (a rounded volt "M" on the dark brand background) stays the source of
 * truth; this emits the raster fallbacks browsers/OSes still want:
 *   favicon-32.png       legacy <link rel="icon"> fallback
 *   apple-touch-icon.png iOS home-screen / Safari pinned-tab (180×180)
 *   icon-192.png         PWA manifest (Android home screen)
 *   icon-512.png         PWA manifest (splash)
 *
 * Like og.png these are committed to git, so prebuild doesn't regenerate them
 * on every CI run — run `npm run favicons` and commit when the mark changes.
 *
 * Fonts: librsvg resolves 'Space Grotesk' to a generic sans at rasterize time
 * (the webfont isn't loaded here) — fine for a single glyph at icon sizes.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

const targets = [
  { name: 'favicon-32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

const svg = await readFile(join(PUBLIC, 'favicon.svg'));

for (const t of targets) {
  // High density so the 64-unit viewBox rasterizes well above the largest
  // target before the downscale, keeping edges crisp.
  await sharp(svg, { density: 768 })
    .resize(t.size, t.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(PUBLIC, t.name));
  console.log(`[favicons] ${t.name} (${t.size}×${t.size})`);
}
