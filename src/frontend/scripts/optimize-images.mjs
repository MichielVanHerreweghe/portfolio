/**
 * optimize-images.mjs — responsive WebP pipeline for project screenshots.
 *
 * The app is shipped as a `client:only` React island (see index.astro), so
 * Astro's build-time <Image> component can't inject optimized URLs into the
 * tree. Instead we pre-generate the responsive variants here and reference
 * them via srcset/sizes (see src/lib/img.js).
 *
 * Source of truth: image-sources/projects/<id>/*.png  (full-page captures,
 * NOT served — kept out of public/ so the multi-MB PNGs never reach the bundle).
 * Output:          public/projects/<id>/<name>-{480,768,1080}.webp + <name>.webp
 *
 * The fixed width set must stay in sync with WIDTHS in src/lib/img.js.
 *
 * Run with:  npm run optimize:images        (skips images already up to date)
 *            npm run optimize:images -- --force   (re-encode everything)
 *
 * Also runs automatically via the `prebuild` / `predev` npm hooks, so a fresh
 * clone produces the served WebP without a manual step.
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_ROOT = join(ROOT, 'image-sources', 'projects');
const OUT_ROOT = join(ROOT, 'public', 'projects');

// Responsive widths emitted as `name-<w>.webp`. The full-resolution encode is
// written as `name.webp` and used both as the largest srcset candidate and as
// the "open original in a new tab" target. Keep in sync with src/lib/img.js.
const WIDTHS = [480, 768, 1080];
const FULL_CAP = 1440; // capture width — never upscale past this
const QUALITY = 80;

const FORCE = process.argv.includes('--force');

async function listDirs(p) {
  const entries = await readdir(p, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

// An image is up to date when its full-resolution WebP exists and is at least
// as new as the source PNG. Editing the script doesn't bump source mtimes, so
// use --force after changing widths/quality.
async function isFresh(srcPath, outDir, name) {
  if (FORCE) return false;
  try {
    const [src, full] = await Promise.all([
      stat(srcPath),
      stat(join(outDir, `${name}.webp`)),
    ]);
    return full.mtimeMs >= src.mtimeMs;
  } catch {
    return false;
  }
}

async function processFile(srcPath, outDir, name) {
  const input = sharp(srcPath, { failOn: 'error' });
  const meta = await input.metadata();
  const origW = meta.width || FULL_CAP;
  const fullW = Math.min(origW, FULL_CAP);

  const jobs = [];
  // Responsive variants — only downscale, never upscale.
  for (const w of WIDTHS) {
    if (w >= fullW) continue;
    jobs.push(
      sharp(srcPath)
        .resize({ width: w })
        .webp({ quality: QUALITY })
        .toFile(join(outDir, `${name}-${w}.webp`))
    );
  }
  // Full-resolution encode (largest candidate + new-tab target).
  jobs.push(
    sharp(srcPath)
      .resize({ width: fullW })
      .webp({ quality: QUALITY })
      .toFile(join(outDir, `${name}.webp`))
  );

  await Promise.all(jobs);
  return { origW, fullW };
}

async function main() {
  let projects;
  try {
    projects = await listDirs(SRC_ROOT);
  } catch {
    console.error(`No source images found at ${SRC_ROOT}`);
    process.exit(1);
  }

  let totalIn = 0;
  let totalOut = 0;
  let generated = 0;
  let skipped = 0;

  for (const proj of projects) {
    const srcDir = join(SRC_ROOT, proj);
    const outDir = join(OUT_ROOT, proj);
    await mkdir(outDir, { recursive: true });

    const files = (await readdir(srcDir)).filter(
      (f) => extname(f).toLowerCase() === '.png'
    );

    for (const f of files) {
      const name = basename(f, extname(f));
      const srcPath = join(srcDir, f);

      if (await isFresh(srcPath, outDir, name)) {
        skipped++;
        continue;
      }

      const inSize = (await stat(srcPath)).size;
      const { origW, fullW } = await processFile(srcPath, outDir, name);
      generated++;

      // Sum the generated outputs for a before/after report.
      let outSize = (await stat(join(outDir, `${name}.webp`))).size;
      for (const w of WIDTHS) {
        if (w >= fullW) continue;
        outSize += (await stat(join(outDir, `${name}-${w}.webp`))).size;
      }
      totalIn += inSize;
      totalOut += outSize;
      const kb = (n) => `${Math.round(n / 1024)}KB`;
      console.log(
        `${proj}/${f}  ${origW}px  ${kb(inSize)} PNG -> ${kb(outSize)} WebP (all sizes)`
      );
    }
  }

  const mb = (n) => `${(n / 1024 / 1024).toFixed(1)}MB`;
  if (generated === 0) {
    console.log(`All ${skipped} image(s) already up to date. Use --force to re-encode.`);
  } else {
    console.log(
      `\nDone. Generated ${generated} image(s)` +
        (skipped ? `, skipped ${skipped} up to date` : '') +
        `. Source ${mb(totalIn)} PNG -> ${mb(totalOut)} WebP across all variants.`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
