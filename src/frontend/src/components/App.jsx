/* App.jsx — router, theme, transitions (wrapped in LangProvider) */
import { useState, useEffect } from 'react';
import { Nav } from './Nav.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { PortfolioPage } from './pages/PortfolioPage.jsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.jsx';
import { LangProvider } from '../lib/i18n.jsx';
import { ROUTES, pathFor, parseLocation } from '../lib/routes.js';

function App({ initialRoute, initialParam }) {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage === "undefined") return "dark";
    return localStorage.getItem("mvh-theme") || "dark";
  });
  // Initial route comes from the Astro page that server-rendered this app, so
  // the SSR HTML and first client render agree. Back/forward then re-derives it
  // from the URL via popstate.
  const [route, setRoute] = useState(initialRoute);
  const [param, setParam] = useState(initialParam);
  const [display, setDisplay] = useState(initialRoute);   // page actually mounted
  const [displayParam, setDisplayParam] = useState(initialParam);
  const [exiting, setExiting] = useState(false);

  // apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mvh-theme", theme);
  }, [theme]);

  // react to browser back/forward
  useEffect(() => {
    const onPop = () => { const r = parseLocation(location.pathname); setRoute(r.route); setParam(r.param); };
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
      history.pushState({}, "", pathFor("project", id));
      setRoute("project"); setParam(id);
      return;
    }
    if (!ROUTES.includes(target) || (target === route && !param)) {
      if (target === route) window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.pushState({}, "", pathFor(target));
    setRoute(target); setParam(null);
  };

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const Page =
    display === "project" ? (props) => <ProjectDetailPage {...props} id={displayParam} />
    : display === "portfolio" ? PortfolioPage
    : display === "about" ? AboutPage
    : HomePage;

  return (
    <>
      <Nav route={route} go={go} theme={theme} toggleTheme={toggleTheme} />
      <main className={exiting ? "page-exit" : ""}>
        <Page key={display} go={go} />
      </main>
    </>
  );
}

export default function Site({ initialRoute = "home", initialParam = null }) {
  return (
    <LangProvider>
      <App initialRoute={initialRoute} initialParam={initialParam} />
    </LangProvider>
  );
}
