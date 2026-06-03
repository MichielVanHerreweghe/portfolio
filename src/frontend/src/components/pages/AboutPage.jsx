/* AboutPage.jsx */
import { Icon } from '../icons.jsx';
import { Button, Reveal, Kicker } from '../primitives.jsx';
import { ContactFooter } from '../ContactFooter.jsx';
import { useT } from '../../lib/i18n.jsx';

function AboutHero() {
  const { C, lang } = useT();
  const u = C.ui;
  return (
    <section className="wrap" style={{ paddingTop: 160, paddingBottom: 30 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 64, alignItems: "center" }} className="about-hero">
        <div>
          <Reveal><Kicker>{u.aboutKicker}</Kicker></Reveal>
          <Reveal delay={70} as="h1" className="display" style={{ fontSize: "clamp(40px,6.5vw,84px)", marginTop: 26 }}>
            {u.aboutH1a}<span style={{ color: "var(--volt-text)" }}>{u.aboutH1b}</span>
          </Reveal>
          <Reveal delay={150}>
            <p style={{ fontSize: 20, lineHeight: 1.65, color: "var(--muted)", marginTop: 30, maxWidth: 560 }}>
              {u.aboutP1}
            </p>
          </Reveal>
          <Reveal delay={210}>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: "var(--muted)", marginTop: 18, maxWidth: 560 }}>
              {u.aboutP2}
            </p>
          </Reveal>
          <Reveal delay={270}>
            <div style={{ display: "flex", gap: 14, marginTop: 38, flexWrap: "wrap" }}>
              <Button as="a" href={`/Resume.html?lang=${lang}`} target="_blank" icon={<Icon.down />}>{u.downloadResume}</Button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={160}>
          <div style={{ position: "relative" }}>
            <image-slot id="headshot" style={{ width: "100%", aspectRatio: "4/5" }} shape="rounded" radius="8" placeholder="Drop your headshot"></image-slot>
            <div className="mono" style={{ position: "absolute", left: 14, bottom: 14, background: "var(--volt)", color: "#0B0B0C", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", padding: "7px 11px", borderRadius: 3 }}>{u.locationBadge}</div>
          </div>
        </Reveal>
      </div>
      <style>{`@media (max-width:900px){ .about-hero { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </section>
  );
}

function StatStrip() {
  const { C } = useT();
  const nums = ["3+", "40+", "99.9%", "∞"];
  const labels = C.ui.statLabels;
  return (
    <section className="wrap" style={{ padding: "60px 40px" }}>
      <div className="card stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: 0, overflow: "hidden" }}>
        {nums.map((n, i) => (
          <Reveal key={i} delay={i * 70} style={{ padding: "34px 28px", borderRight: i < 3 ? "1px solid var(--line)" : "none" }} className="stat-cell">
            <div className="display" style={{ fontSize: "clamp(34px,7vw,46px)", color: "var(--volt-text)" }}>{n}</div>
            <div className="mono" style={{ fontSize: 13, color: "var(--faint)", marginTop: 10, letterSpacing: "0.08em" }}>{labels[i].toUpperCase()}</div>
          </Reveal>
        ))}
      </div>
      <style>{`
        @media (max-width:760px){
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .stats-row .stat-cell { border-right: none !important; }
          .stats-row .stat-cell:nth-child(odd) { border-right: 1px solid var(--line) !important; }
          .stats-row .stat-cell:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
        }
      `}</style>
    </section>
  );
}

function Skills() {
  const { C } = useT();
  const u = C.ui;
  return (
    <section className="wrap" style={{ padding: "60px 40px" }}>
      <Reveal><Kicker>{u.skillsKicker}</Kicker></Reveal>
      <Reveal delay={60}><h2 className="display" style={{ fontSize: "clamp(32px,5vw,56px)", marginTop: 22 }}>{u.skillsHeading}</h2></Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 48 }} className="skills-grid">
        {C.skills.map((s, i) => (
          <Reveal key={s.group} delay={i * 60}>
            <div className="card" style={{ padding: "24px 24px 26px", height: "100%" }}>
              <div className="mono" style={{ fontSize: 12.5, letterSpacing: "0.16em", color: "var(--volt-text)" }}>{s.group.toUpperCase()}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 18 }}>
                {s.items.map(it => <span key={it} style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--line)", padding: "8px 13px", borderRadius: 99 }}>{it}</span>)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <style>{`@media (max-width:900px){ .skills-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function Experience() {
  const { C } = useT();
  const u = C.ui;
  return (
    <section className="wrap" style={{ padding: "60px 40px" }}>
      <Reveal><Kicker>{u.expKicker}</Kicker></Reveal>
      <Reveal delay={60}><h2 className="display" style={{ fontSize: "clamp(32px,5vw,56px)", marginTop: 22 }}>{u.expHeading}</h2></Reveal>
      <div style={{ marginTop: 50 }}>
        {C.experience.map((e, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="xp-row" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 40, padding: "30px 0", borderTop: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 14, color: "var(--faint)", paddingTop: 4 }}>{e.period}</div>
              <div>
                <h3 style={{ fontSize: 24 }}>{e.role}</h3>
                <div style={{ color: "var(--volt-text)", fontSize: 16, fontWeight: 500, marginTop: 5 }}>{e.org}</div>
                <p style={{ color: "var(--muted)", fontSize: 16.5, lineHeight: 1.6, marginTop: 14, maxWidth: 640 }}>{e.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                  {e.tags.map(t => <span key={t} className="mono" style={{ fontSize: 12, color: "var(--faint)", border: "1px solid var(--line)", padding: "5px 10px", borderRadius: 99 }}>{t}</span>)}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <style>{`@media (max-width:760px){ .xp-row { grid-template-columns: 1fr !important; gap: 12px !important; } }`}</style>
    </section>
  );
}

function Education() {
  const { C } = useT();
  const u = C.ui;
  return (
    <section className="wrap" style={{ padding: "30px 40px 60px" }}>
      <Reveal><Kicker>{u.eduKicker}</Kicker></Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 36, alignItems: "start" }} className="edu-grid">
        {/* Studies column */}
        <div>
          <Reveal><div className="mono" style={{ fontSize: 12.5, letterSpacing: "0.16em", color: "var(--volt-text)", marginBottom: 18 }}>{u.eduStudies.toUpperCase()}</div></Reveal>
          <div style={{ display: "grid", gap: 14 }}>
            {C.education.map((e, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card" style={{ padding: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 22 }}>{e.title}</h3>
                    <div style={{ color: "var(--muted)", fontSize: 16, marginTop: 8 }}>{e.org}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 13, color: "var(--faint)", whiteSpace: "nowrap" }}>{e.period}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        {/* Certifications column */}
        <div>
          <Reveal delay={60}><div className="mono" style={{ fontSize: 12.5, letterSpacing: "0.16em", color: "var(--volt-text)", marginBottom: 18 }}>{u.eduCerts.toUpperCase()}</div></Reveal>
          <Reveal delay={120}>
            <div className="card" style={{ padding: 28 }}>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
                {C.certifications.map((c, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 17, color: "var(--text)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--volt)", flex: "0 0 auto" }} />
                    {c.title}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media (max-width:760px){ .edu-grid { grid-template-columns: 1fr !important; gap: 28px !important; } }`}</style>
    </section>
  );
}

function OffTheClock() {
  const { C } = useT();
  const u = C.ui;
  const r = C.reading;
  const iconFor = (k) => (Icon[k] || Icon.book)({});
  return (
    <section className="wrap" style={{ padding: "60px 40px 30px" }}>
      <Reveal><Kicker>{u.otcKicker}</Kicker></Reveal>
      <Reveal delay={60}><h2 className="display" style={{ fontSize: "clamp(32px,5vw,56px)", marginTop: 22 }}>{u.otcHeading}</h2></Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 20, marginTop: 48 }} className="otc-grid">
        {/* Currently reading — featured */}
        <Reveal>
          <div className="card" style={{ padding: 28, height: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="mono" style={{ fontSize: 12.5, letterSpacing: "0.16em", color: "var(--volt-text)", display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--volt)" }} />
                <span className="ping" style={{ position: "absolute", inset: 0, borderRadius: 99, background: "var(--volt)" }} />
              </span>
              {u.currentlyReading}
            </div>
            {r.map((b, i) => (
              <div key={b.title + i} style={{ display: "flex", gap: 22, alignItems: "center", paddingTop: i ? 24 : 0, borderTop: i ? "1px solid var(--line)" : "none" }}>
                <image-slot id={"book-cover-" + i} src={b.cover || undefined} style={{ width: 96, height: 142, flex: "0 0 auto" }} shape="rounded" radius="4" placeholder="cover"></image-slot>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 24, lineHeight: 1.1 }}>{b.title}</h3>
                  <div style={{ color: "var(--muted)", fontSize: 16, marginTop: 8 }}>{b.author}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        {/* Hobby cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gridAutoRows: "1fr", gap: 14, height: "100%" }}>
          {C.hobbies.map((h, i) => (
            <Reveal key={h.title} delay={i * 80} style={{ height: "100%" }}>
              <div className="card otc-card" style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 18, height: "100%" }}>
                <div style={{ width: 46, height: 46, flex: "0 0 auto", borderRadius: 6, background: "var(--surface-2)", border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--volt-text)" }}>
                  {iconFor(h.icon)}
                </div>
                <div>
                  <h3 style={{ fontSize: 20 }}>{h.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.5, marginTop: 5 }}>{h.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        .otc-card { transition: transform .3s var(--ease), border-color .3s; }
        .otc-card:hover { transform: translateY(-3px); border-color: var(--volt); }
        .ping { animation: ping 2s var(--ease) infinite; }
        @keyframes ping { 0%{ transform: scale(1); opacity: .7; } 70%,100%{ transform: scale(2.6); opacity: 0; } }
        @media (max-width:900px){ .otc-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

export function AboutPage({ go }) {
  return (
    <div className="page">
      <AboutHero />
      <StatStrip />
      <Skills />
      <Experience />
      <Education />
      <OffTheClock />
      <ContactFooter go={go} />
    </div>
  );
}
