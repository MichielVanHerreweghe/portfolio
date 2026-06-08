/**
 * render-nginx-csp.mjs — inject the inline-script CSP hashes into nginx.conf.
 *
 * The whole site ships as a `client:load` React island, so Astro injects two
 * inline bootstrap scripts (the `self.Astro.load` loader and the `<astro-island>`
 * hydration runtime) into every page, and Layout.astro adds one more (the
 * pre-paint theme/lang setter). Our CSP is `script-src 'self'` with NO
 * 'unsafe-inline', so each inline script must be allow-listed by its sha256
 * hash — otherwise the browser blocks them and React never hydrates.
 *
 * Rather than hand-maintain those hashes (the two Astro-runtime ones change on
 * an astro/@astrojs/react upgrade), nginx.conf carries a `__CSP_SCRIPT_HASHES__`
 * token. This script — wired as the `postbuild` npm hook, so it runs on local
 * builds, in CI (`npm run build`), and inside the Docker image build —
 * recomputes the hashes from the freshly built dist/ and writes the resolved
 * config to nginx.conf.rendered. The Docker runtime stage copies that rendered
 * file as its envsubst template (see Dockerfile), so the shipped CSP always
 * matches the shipped scripts.
 *
 * The committed nginx.conf keeps the token (never the hashes); the rendered
 * output is a build artifact and is gitignored.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendDir = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(frontendDir, 'dist');
const templatePath = join(frontendDir, 'nginx.conf');
const outputPath = join(frontendDir, 'nginx.conf.rendered');

const TOKEN = '__CSP_SCRIPT_HASHES__';

// A <script> is executable (and thus CSP-governed) when it has no `type` or a
// JS type. Data blocks like application/ld+json or importmap are not executed,
// so the browser never checks them against script-src — skip them.
const JS_TYPES = new Set(['', 'text/javascript', 'module', 'application/javascript']);

/** Recursively collect every .html file under dir. */
async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** sha256-<base64> over the exact text content, matching the browser's CSP hash. */
function cspHash(body) {
  return 'sha256-' + createHash('sha256').update(body, 'utf8').digest('base64');
}

const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
const typeRe = /\btype\s*=\s*["']?([^"'\s>]*)/i;

async function main() {
  const files = await htmlFiles(distDir);
  if (files.length === 0) {
    console.error(`[csp] no HTML found in ${relative(frontendDir, distDir)} — run the build first.`);
    process.exit(1);
  }

  const hashes = new Set();
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    let m;
    while ((m = scriptRe.exec(html))) {
      const attrs = m[1];
      const body = m[2];
      if (/\bsrc\s*=/.test(attrs)) continue; // external — covered by 'self'
      const type = (attrs.match(typeRe)?.[1] ?? '').toLowerCase();
      if (!JS_TYPES.has(type)) continue; // data block, not executed
      hashes.add(cspHash(body));
    }
  }

  const template = await readFile(templatePath, 'utf8');
  // Anchor on `'self'<token>` so we only touch the real script-src directives —
  // not prose mentions of the token in the surrounding comments.
  const target = `'self'${TOKEN}`;
  if (!template.includes(target)) {
    console.error(`[csp] "${target}" not found in nginx.conf — the script-src placeholder is missing.`);
    process.exit(1);
  }

  // Sorted for deterministic output; each hash prefixed with a space so the
  // directive reads `script-src 'self' 'sha256-…';` (and just `'self'` with no
  // stray space if there were ever zero inline scripts).
  const injected = [...hashes].sort().map((h) => ` '${h}'`).join('');
  const rendered = template.split(target).join(`'self'${injected}`);

  await writeFile(outputPath, rendered);
  console.log(`[csp] rendered ${relative(frontendDir, outputPath)} with ${hashes.size} inline script hash(es):`);
  for (const h of [...hashes].sort()) console.log(`        '${h}'`);
}

main().catch((err) => {
  console.error('[csp] render failed:', err);
  process.exit(1);
});
