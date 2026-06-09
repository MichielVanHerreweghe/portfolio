/* App.jsx — router, theme, transitions (wrapped in LangProvider) */
import { useState, useEffect } from 'react';
import { Nav } from './Nav.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { PortfolioPage } from './pages/PortfolioPage.jsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.jsx';
import { LangProvider, useT } from '../lib/i18n.jsx';
import { ROUTES, pathFor, parseLocation } from '../lib/routes.js';

function App({ initialRoute, initialParam }) {
  const { lang, setLang } = useT();
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage === "undefined") return "dark";
    return localStorage.getItem("mvh-theme") || "dark";
  });
  // Initial route comes from the Astro page that server-rendered this app, so
  // the SSR HTML and first client render agree. Back/forward then re-derives it
  // (route + param + locale) from the URL via popstate.
  const [route, setRoute] = useState(initialRoute);
  const [param, setParam] = useState(initialParam);
  const [display, setDisplay] = useState(initialRoute);   // page actually mounted
  const [displayParam, setDisplayParam] = useState(initialParam);
  const [exiting, setExiting] = useState(false);

  // Arm scroll-reveal once mounted. Until this lands, `.reveal` is visible by
  // default (see global.css) so server-rendered content paints before — and
  // without — hydration; this opts in to the hidden-then-animate behaviour.
  // Child useReveal effects run before this parent effect and synchronously
  // mark in-view elements `.in`, so arming can't flash above-the-fold content.
  useEffect(() => { document.documentElement.classList.add("reveal-armed"); }, []);

  // apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mvh-theme", theme);
  }, [theme]);

  // react to browser back/forward — restore route, param AND locale from the URL
  useEffect(() => {
    const onPop = () => {
      const r = parseLocation(location.pathname);
      setRoute(r.route); setParam(r.param); setLang(r.lang);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // animate page swap when route changes
  useEffect(() => {
    if (route === display && param === displayParam) return;
    setExiting(true);
    const t = setTimeout(() => {
      setDisplay(route);
      setDisplayParam(param);
      setExiting(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 300);
    return () => clearTimeout(t);
  }, [route, param]);

  const go = (target, id) => {
    if (target === "contact") {
      const doScroll = () => {
        const el = document.getElementById("contact");
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 8;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      };
      setTimeout(doScroll, 50);
      return;
    }
    if (target === "project" && id) {
      history.pushState({}, "", pathFor("project", id, lang));
      setRoute("project"); setParam(id);
      return;
    }
    if (!ROUTES.includes(target) || (target === route && !param)) {
      if (target === route) window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.pushState({}, "", pathFor(target, null, lang));
    setRoute(target); setParam(null);
  };

  // Switch language by NAVIGATING to the same logical page in the new locale —
  // each language is a distinct, indexable URL, so a swap is a real route
  // change (pushState), not an in-place content swap.
  const switchLang = (code) => {
    if (code === lang) return;
    history.pushState({}, "", pathFor(route, param, code));
    setLang(code);
  };

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const Page =
    display === "project" ? (props) => <ProjectDetailPage {...props} id={displayParam} />
    : display === "portfolio" ? PortfolioPage
    : display === "about" ? AboutPage
    : HomePage;

  return (
    <>
      <Nav route={route} go={go} theme={theme} toggleTheme={toggleTheme} switchLang={switchLang} />
      <main className={exiting ? "page-exit" : ""}>
        <Page key={display} go={go} />
      </main>
    </>
  );
}

export default function Site({ initialRoute = "home", initialParam = null, initialLang = "en" }) {
  return (
    <LangProvider initialLang={initialLang}>
      <App initialRoute={initialRoute} initialParam={initialParam} />
    </LangProvider>
  );
}
