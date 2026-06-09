/* useBlogChrome.jsx — shared chrome behaviour for the Astro-rendered blog.
 *
 * The blog lives outside the SPA, so the Nav can't pushState into a client
 * router — every destination is a real page. This hook supplies the handlers
 * the existing <Nav> expects (go / switchLang / theme), wired to real
 * navigation, plus the theme state (mirroring App.jsx so the toggle and the
 * pre-paint inline script in Layout.astro agree). */
import { useState, useEffect } from 'react';
import { pathFor } from '../lib/routes.js';

/**
 * @param {string} lang   current locale ('en' | 'nl' | 'fr')
 * @param {Record<string,string>} langPaths  absolute URL of THIS page per
 *        locale ({ en, nl, fr }) — used by the language switcher so a swap
 *        lands on the same post/index in the new language.
 */
export function useBlogChrome(lang, langPaths = {}) {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage === 'undefined') return 'dark';
    return localStorage.getItem('mvh-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('mvh-theme', theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Nav targets: 'contact' scrolls to the footer (present on every blog page);
  // 'blog' is the section we're already in, so scroll to top; anything else is
  // a real navigation back into the SPA-rendered pages.
  const go = (target) => {
    if (target === 'contact') {
      const el = document.getElementById('contact');
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 8;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      return;
    }
    if (target === 'blog') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    location.href = pathFor(target, null, lang);
  };

  const switchLang = (code) => {
    if (code === lang) return;
    location.href = langPaths[code] || pathFor('blog', null, code);
  };

  return { theme, toggleTheme, go, switchLang };
}
