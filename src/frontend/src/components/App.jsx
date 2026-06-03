/* App.jsx — router, theme, transitions (wrapped in LangProvider) */
import { useState, useEffect } from 'react';
import { Nav } from './Nav.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { PortfolioPage } from './pages/PortfolioPage.jsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.jsx';
import { LangProvider } from '../lib/i18n.jsx';

const ROUTES = ["home", "portfolio", "about"];

function parseHash() {
  if (typeof location === "undefined") return { route: "home", param: null };
  const h = (location.hash || "").replace(/^#\/?/, "").trim();
  const [base, param] = h.split("/");
  if (base === "project" && param) return { route: "project", param };
  return { route: ROUTES.includes(base) ? base : "home", param: null };
}

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage === "undefined") return "dark";
    return localStorage.getItem("mvh-theme") || "dark";
  });
  const init = parseHash();
  const [route, setRoute] = useState(init.route);
  const [param, setParam] = useState(init.param);
  const [display, setDisplay] = useState(init.route);   // page actually mounted
  const [displayParam, setDisplayParam] = useState(init.param);
  const [exiting, setExiting] = useState(false);

  // apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mvh-theme", theme);
  }, [theme]);

  // react to hash changes (back/forward)
  useEffect(() => {
    const onHash = () => { const r = parseHash(); setRoute(r.route); setParam(r.param); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
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
      location.hash = "/project/" + id;
      setRoute("project"); setParam(id);
      return;
    }
    if (!ROUTES.includes(target) || (target === route && !param)) {
      if (target === route) window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    location.hash = "/" + target;
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

export default function Site() {
  return (
    <LangProvider>
      <App />
    </LangProvider>
  );
}
