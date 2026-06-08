/* routes.js — single source of truth for locale-aware path routing.
 *
 * The site ships as real, crawlable Astro pages, statically pre-rendered per
 * locale: English at the root (/, /portfolio/, /about/, /projects/<slug>/) and
 * Dutch/French path-prefixed (/nl/…, /fr/…). Each page mounts the same React
 * app and hands it an initial route + locale. Client-side navigation then uses
 * the History API (pushState) so the SPA transitions still work, while every
 * destination remains a real, indexable URL.
 *
 * Paths are emitted with a trailing slash to match the canonical/sitemap form
 * (Astro builds directory-style: /about/ → /about/index.html). */

export const LOCALES = ['en', 'nl', 'fr'];
export const DEFAULT_LOCALE = 'en';
export const ROUTES = ['home', 'portfolio', 'about'];

/** Logical route + optional param → path segment (no locale, no slashes). */
function segmentFor(route, param) {
  if (route === 'project' && param) return 'projects/' + param;
  if (route === 'portfolio') return 'portfolio';
  if (route === 'about') return 'about';
  return ''; // home
}

/** Build the URL path for a logical route + optional param, in a given locale.
 *  Always trailing-slashed. e.g. pathFor('about', null, 'nl') → '/nl/about/'. */
export function pathFor(route, param, lang = DEFAULT_LOCALE) {
  const seg = segmentFor(route, param);
  const prefix = lang && lang !== DEFAULT_LOCALE ? '/' + lang : '';
  return prefix + '/' + (seg ? seg + '/' : '');
}

/** Map a real pathname back to { lang, route, param }. Tolerates a missing or
 *  present trailing slash and an optional leading locale segment. */
export function parseLocation(pathname) {
  if (typeof pathname !== 'string') return { lang: DEFAULT_LOCALE, route: 'home', param: null };
  let parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  let lang = DEFAULT_LOCALE;
  if (parts[0] && LOCALES.includes(parts[0]) && parts[0] !== DEFAULT_LOCALE) {
    lang = parts[0];
    parts = parts.slice(1);
  }
  if (parts[0] === 'projects' && parts[1]) return { lang, route: 'project', param: parts[1] };
  if (parts[0] === 'portfolio') return { lang, route: 'portfolio', param: null };
  if (parts[0] === 'about') return { lang, route: 'about', param: null };
  return { lang, route: 'home', param: null };
}

/** Should an anchor click be handled in-app, or left to the browser?
 *  Lets modifier-clicks / middle-clicks open in a new tab as expected. */
export function isPlainLeftClick(e) {
  return !(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
}
