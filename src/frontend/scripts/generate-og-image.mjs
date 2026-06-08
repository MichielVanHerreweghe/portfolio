/**
 * generate-og-image.mjs — emits /public/og.png from an inline SVG template.
 *
 * Every page in Layout.astro declares `<meta property="og:image" content="/og.png">`.
 * This script is the source of truth for that asset: edit the SVG below, then
 * `npm run og:image` to re-rasterize.
 *
 * Runs at 1200×630 (LinkedIn/Twitter/Facebook canonical card size). The PNG is
 * tracked in git so prebuild doesn't have to regenerate it on every CI run —
 * regenerate locally and commit when the design changes.
 *
 * Why a script and not a static asset? The visual style follows site tokens
 * (dark background #0B0B0C, volt accent #FFD000, Space Grotesk / JetBrains
 * Mono families). Keeping the source in code means a future restyle is a
 * diff, not a Photoshop hunt.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'og.png');

const W = 1200;
const H = 630;

// Site tokens — mirror values from src/styles/global.css.
const BG = '#0B0B0C';
const VOLT = '#FFD000';
const TEXT = '#F2F2F2';
const MUTED = '#9A9A9D';
const LINE = '#26262A';

// SVG source. Fonts fall back to system sans/mono — embedding the actual
// Space Grotesk / JetBrains Mono webfonts would inflate the script for a one-
// off raster, so we render with a generic sans-serif family list that sharp's
// librsvg backend resolves at rasterize time.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="17" cy="17" r="1.3" fill="${TEXT}" fill-opacity="0.07"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BG}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="1"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>

  <!-- Kicker -->
  <text x="80" y="160" font-family="ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace"
        font-size="22" letter-spacing="3" fill="${VOLT}" font-weight="600">
    INFRASTRUCTURE × CODE
  </text>

  <!-- Headline -->
  <text x="80" y="280" font-family="'Space Grotesk', system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="92" font-weight="700" fill="${TEXT}">
    Michiel Van
  </text>
  <text x="80" y="380" font-family="'Space Grotesk', system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="92" font-weight="700" fill="${TEXT}">
    Herreweghe
  </text>

  <!-- Subhead -->
  <text x="80" y="460" font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="28" font-weight="400" fill="${MUTED}">
    DevOps &amp; Software Engineer — Belgium
  </text>

  <!-- Bottom strip -->
  <line x1="80" y1="540" x2="${W - 80}" y2="540" stroke="${LINE}" stroke-width="1"/>
  <text x="80" y="580" font-family="ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace"
        font-size="20" letter-spacing="2" fill="${MUTED}">
    nomaddigital.dev
  </text>
  <text x="${W - 80}" y="580" text-anchor="end"
        font-family="ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace"
        font-size="20" letter-spacing="2" fill="${VOLT}">
    K8S · TERRAFORM · .NET
  </text>
</svg>
`;

await mkdir(dirname(OUT), { recursive: true });
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`✓ og.png written to ${OUT} (${W}×${H})`);
