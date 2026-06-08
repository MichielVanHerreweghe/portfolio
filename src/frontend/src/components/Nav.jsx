/* Nav.jsx — branded nav with links, language menu, theme toggle, mobile panel */
import { useState, useEffect } from 'react';
import { Icon } from './icons.jsx';
import { Button } from './primitives.jsx';
import { useT, LANGS } from '../lib/i18n.jsx';
import { pathFor, isPlainLeftClick } from '../lib/routes.js';

export function Nav({ route, go, theme, toggleTheme, switchLang }) {
  const { lang, C } = useT();
  const u = C.ui;
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => {
    if (!langOpen) return;
    const h = (e) => { if (!e.target.closest(".lang-wrap")) setLangOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [langOpen]);

  const links = [["home", u.navHome], ["portfolio", u.navWork], ["about", u.navAbout]];
  const nav = (id) => { setOpen(false); go(id); };
  // Render nav items as real <a href> (crawlable, work without JS) but
  // intercept plain left-clicks so client-side navigation keeps the SPA feel.
  const navClick = (id) => (e) => { if (isPlainLeftClick(e)) { e.preventDefault(); nav(id); } };
  const cur = LANGS.find(l => l.code === lang) || LANGS[0];
  const pickLang = (code) => { switchLang(code); setLangOpen(false); };

  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="nav-progress" style={{ width: progress + "%" }} />
      <div className="nav-inner">
        <a className="brand" href={pathFor("home", null, lang)} onClick={navClick("home")} aria-label="Michiel Van Herreweghe — home">
          <span className="monogram">M</span>
          <span className="wordmark">
            <b><span className="wm-full">Michiel Van&nbsp;Herreweghe</span><span className="wm-short">Michiel V.H.</span></b>
            <small>{u.tagline}</small>
          </span>
        </a>

        <div className="nav-right">
          <div className="nav-links desktop-only">
            {links.map(([id, label]) => (
              <a key={id} href={pathFor(id, null, lang)} className={"nav-link" + (route === id ? " active" : "")} onClick={navClick(id)}>{label}</a>
            ))}
          </div>
          <span className="nav-divider desktop-only" />
          <div className="nav-actions">
            {/* language */}
            <div className="lang-wrap desktop-only" style={{ position: "relative" }}>
              <button className="lang-btn" onClick={() => setLangOpen(o => !o)} aria-label={u.langLabel} aria-expanded={langOpen} title={u.langLabel}>
                <Icon.globe /><span className="mono" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em" }}>{cur.short}</span>
              </button>
              {langOpen && (
                <div className="lang-menu">
                  {LANGS.map(l => (
                    <button key={l.code} className={"lang-item" + (l.code === lang ? " active" : "")} onClick={() => pickLang(l.code)}>
                      <span>{l.label}</span>{l.code === lang && <Icon.check />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
            </button>
            <Button as="a" href={`/Resume.html?lang=${lang}`} target="_blank" variant="ghost" className="desktop-only" icon={<Icon.down />} style={{ padding: "11px 18px", fontSize: 14.5 }}>{u.resume}</Button>
            <Button onClick={() => nav("contact")} className="desktop-only" icon={<Icon.arrow />} style={{ padding: "11px 20px", fontSize: 14.5 }}>{u.getInTouch}</Button>
            <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>
              {open
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            </button>
          </div>
        </div>
      </div>

      {/* mobile dropdown */}
      <div className={"mobile-panel" + (open ? " open" : "")}>
        <div className="mp-inner">
          {links.map(([id, label]) => (
            <a key={id} href={pathFor(id, null, lang)} className={"mp-link" + (route === id ? " active" : "")} onClick={navClick(id)}>
              {label} {route === id && <span className="mono" style={{ fontSize: 13, color: "var(--volt-text)" }}>● {u.now}</span>}
            </a>
          ))}
          <button className="mp-link" onClick={() => nav("contact")}>{u.navContact} <Icon.arrow /></button>
          {/* language pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <span className="mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--faint)", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8 }}><Icon.globe /> {u.langLabel}</span>
            {LANGS.map(l => (
              <button key={l.code} onClick={() => switchLang(l.code)} className="mono"
                style={{ fontSize: 14, fontWeight: 600, padding: "8px 14px", borderRadius: 99, border: "1px solid var(--line)", background: l.code === lang ? "var(--volt)" : "transparent", color: l.code === lang ? "#0B0B0C" : "var(--muted)" }}>
                {l.short}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Button as="a" href={`/Resume.html?lang=${lang}`} target="_blank" icon={<Icon.down />} style={{ flex: 1, justifyContent: "center" }}>{u.resume}</Button>
            <Button onClick={toggleTheme} variant="ghost" style={{ justifyContent: "center" }}>
              {theme === "dark" ? <Icon.sun /> : <Icon.moon />} {theme === "dark" ? "Light" : "Dark"}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .lang-btn { display: inline-flex; align-items: center; gap: 7px; height: 40px; padding: 0 13px; border-radius: 99px; border: 1px solid var(--line); background: var(--surface); color: var(--text); transition: border-color 0.2s; }
        .lang-btn:hover { border-color: var(--volt); }
        .lang-menu { position: absolute; top: calc(100% + 10px); right: 0; min-width: 178px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; box-shadow: var(--shadow); padding: 6px; display: flex; flex-direction: column; gap: 2px; z-index: 200; animation: pageIn 0.22s var(--ease) both; }
        .lang-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; text-align: left; padding: 11px 13px; border-radius: 5px; background: none; border: none; color: var(--text); font-size: 15px; font-weight: 500; font-family: inherit; }
        .lang-item:hover { background: var(--surface-2); }
        .lang-item.active { color: var(--volt-text); }
      `}</style>
    </nav>
  );
}
