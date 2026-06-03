/* PortfolioPage.jsx */
import { useState } from 'react';
import { Icon } from '../icons.jsx';
import { Reveal, Kicker } from '../primitives.jsx';
import { ContactFooter } from '../ContactFooter.jsx';
import { useT } from '../../lib/i18n.jsx';

function PortfolioHero({ filter, setFilter }) {
  const { C } = useT();
  const u = C.ui;
  const tags = [{ key: "all", label: u.filterAll }, { key: "Design", label: "Design" }, { key: "Web", label: "Web" }, { key: "API", label: "API" }, { key: "CI/CD", label: "CI/CD" }];
  return (
    <section className="wrap" style={{ paddingTop: 160, paddingBottom: 20 }}>
      <Reveal><Kicker>{u.portfolioKicker}</Kicker></Reveal>
      <Reveal delay={70} as="h1" className="display" style={{ fontSize: "clamp(44px,7vw,96px)", marginTop: 26 }}>
        {u.portfolioH1a}<br />{u.portfolioH1b}
      </Reveal>
      <Reveal delay={150}>
        <p style={{ fontSize: 20, color: "var(--muted)", marginTop: 26, maxWidth: 560, lineHeight: 1.6 }}>
          {u.portfolioIntro}
        </p>
      </Reveal>
      <Reveal delay={210}>
        <div style={{ display: "flex", gap: 10, marginTop: 38, flexWrap: "wrap" }}>
          {tags.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} className="mono filter-pill"
              style={{ fontSize: 13, letterSpacing: "0.06em", padding: "10px 16px", borderRadius: 99, border: "1px solid var(--line)", background: filter === t.key ? "var(--volt)" : "transparent", color: filter === t.key ? "#0B0B0C" : "var(--muted)", fontWeight: 600, transition: "all .2s" }}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ProjectCard({ p, big }) {
  const { C } = useT();
  const u = C.ui;
  return (
    <Reveal>
      <a href={"#/project/" + p.id} className="card proj-card" style={{ display: "block", overflow: "hidden", color: "var(--text)", height: "100%" }}>
        <div style={{ position: "relative" }}>
          <image-slot id={"port-" + p.id} src={p.cover} style={{ width: "100%", height: big ? 420 : 260 }} shape="rect" placeholder={p.kind}></image-slot>
          <span className="mono proj-visit" style={{ position: "absolute", top: 14, right: 14, background: "var(--volt)", color: "#0B0B0C", fontSize: 12, fontWeight: 700, padding: "8px 12px", borderRadius: 3, display: "inline-flex", alignItems: "center", gap: 7, opacity: 0, transform: "translateY(-6px)", transition: "all .3s var(--ease)" }}>
            {u.visit.toUpperCase()} <Icon.arrowUR />
          </span>
        </div>
        <div style={{ padding: big ? "30px 32px" : "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span className="mono" style={{ fontSize: 12, color: "var(--volt-text)", letterSpacing: "0.1em" }}>{p.kind.toUpperCase()}</span>
            <span style={{ width: 3, height: 3, borderRadius: 99, background: "var(--faint)" }} />
            <span className="mono" style={{ fontSize: 12, color: "var(--faint)" }}>{p.year}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <h3 style={{ fontSize: big ? 34 : 24 }}>{p.title}</h3>
            <span className="mono" style={{ fontSize: 13, color: "var(--faint)", whiteSpace: "nowrap" }}>{p.role}</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: big ? 17 : 15, lineHeight: 1.6, marginTop: 12, maxWidth: big ? 620 : "none" }}>{p.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
            {p.tags.map(t => <span key={t} className="mono" style={{ fontSize: 12, color: "var(--faint)", border: "1px solid var(--line)", padding: "5px 10px", borderRadius: 99 }}>{t}</span>)}
          </div>
        </div>
      </a>
    </Reveal>
  );
}

export function PortfolioPage({ go }) {
  const { C } = useT();
  const u = C.ui;
  const [filter, setFilter] = useState("all");
  const all = C.projects;
  const shown = filter === "all" ? all : all.filter(p => p.tags.includes(filter));
  const featured = shown.find(p => p.featured) || shown[0];
  const rest = shown.filter(p => p !== featured);

  return (
    <div className="page">
      <PortfolioHero filter={filter} setFilter={setFilter} />
      <section className="wrap" style={{ padding: "30px 40px 80px" }}>
        {featured && <div style={{ marginBottom: 20 }}><ProjectCard p={featured} big /></div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }} className="port-grid">
          {rest.map(p => <ProjectCard key={p.id} p={p} />)}
        </div>
        {shown.length === 0 && (
          <div className="mono" style={{ textAlign: "center", padding: "80px 0", color: "var(--faint)" }}>// {u.noProjects} "{filter}"</div>
        )}
      </section>
      <ContactFooter go={go} />
      <style>{`
        .proj-card { transition: transform .35s var(--ease), border-color .35s; }
        .proj-card:hover { transform: translateY(-6px); border-color: var(--volt); }
        .proj-card:hover .proj-visit { opacity: 1; transform: none; }
        .filter-pill:hover { border-color: var(--volt); }
        @media (max-width:820px){ .port-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
