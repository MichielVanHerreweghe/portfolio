/* routes.js — single source of truth for path-based routing.
 *
 * The site is delivered as real, crawlable Astro pages (/, /portfolio, /about,
 * /projects/<slug>) that each mount the same React app and hand it an initial
 * route. Client-side navigation then uses the History API (pushState) so the
 * SPA page transitions still work, while every destination remains a real URL
 * that search engines can index. */

export const ROUTES = ["home", "portfolio", "about"];

/** Build the URL path for a logical route + optional param (project slug). */
export function pathFor(route, param) {
  if (route === "project" && param) return "/projects/" + param;
  if (route === "portfolio") return "/portfolio";
  if (route === "about") return "/about";
  return "/";
}

/** Map a real pathname back to a logical { route, param }. */
export function parseLocation(pathname) {
  if (typeof pathname !== "string") return { route: "home", param: null };
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts[0] === "projects" && parts[1]) return { route: "project", param: parts[1] };
  if (parts[0] === "portfolio") return { route: "portfolio", param: null };
  if (parts[0] === "about") return { route: "about", param: null };
  return { route: "home", param: null };
}

/** Should an anchor click be handled in-app, or left to the browser?
 *  Lets modifier-clicks / middle-clicks open in a new tab as expected. */
export function isPlainLeftClick(e) {
  return !(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
}
