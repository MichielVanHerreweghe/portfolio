/* HomePage.jsx */
import { Icon } from '../icons.jsx';
import { Button, Reveal, Kicker, Marquee } from '../primitives.jsx';
import { ContactFooter } from '../ContactFooter.jsx';
import { useT } from '../../lib/i18n.jsx';
import { srcSet, sizes } from '../../lib/img.js';

function HomeHero({ go }) {
  const { C, lang } = useT();
  const u = C.ui;
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(color-mix(in srgb, var(--text) 7%, transparent) 1.3px, transparent 1.3px)", backgroundSize: "34px 34px", maskImage: "linear-gradient(180deg, #000 30%, transparent)", WebkitMaskImage: "linear-gradient(180deg, #000 30%, transparent)" }} />
      <div className="wrap" style={{ position: "relative", paddingTop: 168, paddingBottom: 70 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.12fr 0.88fr", gap: 56, alignItems: "center" }} className="hero-grid">
          <div>
            <Reveal><Kicker>{u.heroKicker}</Kicker></Reveal>
            <Reveal delay={70} as="h1" className="display" style={{ fontSize: "clamp(48px, 8.2vw, 104px)", marginTop: 28 }}>
              Michiel<br />Van Herre&shy;weghe
            </Reveal>
            <Reveal delay={150}>
              <p style={{ fontSize: "clamp(18px,2.2vw,24px)", lineHeight: 1.5, color: "var(--muted)", marginTop: 30, maxWidth: 540 }}>
                {u.heroIntro}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div style={{ display: "flex", gap: 14, marginTop: 42, flexWrap: "wrap" }}>
                <Button onClick={() => go("portfolio")} icon={<Icon.arrow />}>{u.viewWork}</Button>
                <Button as="a" href={`Resume.html?lang=${lang}`} target="_blank" variant="ghost" icon={<Icon.down />}>{u.downloadCV}</Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={180}>
            <TerminalCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TerminalCard() {
  const lines = [
    { t: "$ kubectl rollout status", c: "p" },
    { t: 'deployment "api" rolled out ✓', c: "m" },
    { t: "$ terraform apply", c: "p", gap: true },
    { t: "Apply complete. 14 added,", c: "m" },
    { t: "0 changed, 0 destroyed.", c: "m" },
    { t: "$ uptime", c: "p", gap: true, badge: "99.98%" },
  ];
  return (
    <div style={{ background: "var(--volt)", borderRadius: 8, padding: "22px 24px", boxShadow: "0 40px 80px -30px rgba(255,208,0,0.45)" }}>
      <div style={{ display: "flex", gap: 7, marginBottom: 18 }}>
        {[0,1,2].map(i => <span key={i} style={{ width: 11, height: 11, borderRadius: 99, background: "#0B0B0C", opacity: 0.85 }} />)}
      </div>
      <div className="mono" style={{ fontSize: 15, lineHeight: 2.05, color: "#0B0B0C" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ marginTop: l.gap ? 14 : 0, opacity: l.c === "m" ? 0.62 : 1 }}>
            {l.t}{l.badge && <span style={{ background: "#0B0B0C", color: "var(--volt)", padding: "1px 7px", marginLeft: 8, borderRadius: 2 }}>{l.badge}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Services() {
  const { C } = useT();
  const u = C.ui;
  return (
    <section className="wrap" style={{ padding: "100px 40px 30px" }}>
      <Reveal><Kicker>{u.servicesKicker}</Kicker></Reveal>
      <Reveal delay={60}>
        <h2 className="display" style={{ fontSize: "clamp(34px,5vw,60px)", marginTop: 22, maxWidth: 760 }}>
          {u.servicesHeading}
        </h2>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 54 }} className="svc-grid">
        {C.services.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <div className="card svc-card" style={{ padding: 30, height: "100%" }}>
              <div className="mono" style={{ fontSize: 14, color: "var(--volt-text)", letterSpacing: "0.1em" }}>{s.n}</div>
              <h3 style={{ fontSize: 25, marginTop: 24, marginBottom: 14 }}>{s.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6 }}>{s.body}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                {s.tags.map(t => <span key={t} className="mono" style={{ fontSize: 12, color: "var(--faint)", border: "1px solid var(--line)", padding: "5px 10px", borderRadius: 99 }}>{t}</span>)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <style>{`
        .svc-card:hover { transform: translateY(-6px); border-color: var(--volt); }
        @media (max-width: 900px){ .svc-grid { grid-template-columns: 1fr !important; } .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function FeaturedWork({ go }) {
  const { C } = useT();
  const u = C.ui;
  const items = C.projects.slice(0, 3);
  return (
    <section className="wrap" style={{ padding: "90px 40px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <Reveal><Kicker>{u.featuredKicker}</Kicker></Reveal>
          <Reveal delay={60}><h2 className="display" style={{ fontSize: "clamp(34px,5vw,60px)", marginTop: 22 }}>{u.featuredHeading}</h2></Reveal>
        </div>
        <Reveal delay={100}>
          <button onClick={() => go("portfolio")} className="mono" style={{ background: "none", border: "none", color: "var(--text)", fontSize: 14, letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: 10 }}>
            {u.allProjects.toUpperCase()} <Icon.arrow />
          </button>
        </Reveal>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 44 }} className="feat-grid">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <button onClick={() => go("portfolio")} className="card feat-card" style={{ padding: 0, textAlign: "left", width: "100%", overflow: "hidden", display: "block", color: "var(--text)" }}>
              <image-slot id={"home-" + p.id} src={p.cover} srcset={srcSet(p.cover)} sizes={sizes(33)} style={{ width: "100%", height: 200 }} shape="rect" placeholder={p.kind}></image-slot>
              <div style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: 21 }}>{p.title}</h3>
                  <span className="mono" style={{ fontSize: 12, color: "var(--faint)" }}>{p.year}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 10, lineHeight: 1.55 }}>{p.desc}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
      <style>{`
        .feat-card { transition: transform .35s var(--ease), border-color .35s; }
        .feat-card:hover { transform: translateY(-6px); border-color: var(--volt); }
        @media (max-width: 900px){ .feat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

export function HomePage({ go }) {
  const { C } = useT();
  return (
    <div className="page">
      <HomeHero go={go} />
      <Marquee items={C.stack} />
      <Services />
      <FeaturedWork go={go} />
      <ContactFooter go={go} />
    </div>
  );
}
