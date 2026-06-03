/* ProjectDetailPage.jsx — case-study view for a single project.
   Scaffolded by the `add-portfolio-project` skill. Reads the project from
   C.projects by id, shows its copy + metadata, and renders a gallery of the
   captured page screenshots (p.shots). Styled to match the rest of the site.

   Gallery: an uneven grid of capped tiles. Each tile shows the top of a
   full-page screenshot; on hover it lifts/zooms and the image scroll-reveals
   the whole page (object-position animates top -> bottom). Click opens the
   full screenshot in a new tab. */
import { Icon } from '../icons.jsx';
import { Reveal, Kicker, Button } from '../primitives.jsx';
import { ContactFooter } from '../ContactFooter.jsx';
import { useT } from '../../lib/i18n.jsx';
import { thumbSrcSet, thumbSrc, sizes } from '../../lib/img.js';

export function ProjectDetailPage({ go, id }) {
  const { C } = useT();
  const u = C.ui;
  const p = C.projects.find((x) => x.slug === id || x.id === id);

  if (!p) {
    return (
      <div className="page">
        <section className="wrap" style={{ paddingTop: 160, paddingBottom: 120 }}>
          <Kicker>404</Kicker>
          <h1 className="display" style={{ fontSize: "clamp(40px,6vw,72px)", marginTop: 20 }}>{u.projectNotFound || "Project not found"}</h1>
          <button onClick={() => go("portfolio")} className="mono" style={{ marginTop: 30, color: "var(--volt-text)", background: "none", border: "none", cursor: "pointer" }}>
            ← {u.backToWork || "Back to work"}
          </button>
        </section>
      </div>
    );
  }

  const shots = p.shots || [];

  return (
    <div className="page">
      <section className="wrap" style={{ paddingTop: 140, paddingBottom: 30 }}>
        <Reveal>
          <button onClick={() => go("portfolio")} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, letterSpacing: "0.06em", color: "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            ← {u.backToWork || "Back to work"}
          </button>
        </Reveal>
        <Reveal delay={60}><Kicker>{p.kind}</Kicker></Reveal>
        <Reveal delay={120} as="h1" className="display" style={{ fontSize: "clamp(40px,6.5vw,88px)", marginTop: 22 }}>
          {p.title}
        </Reveal>
        <Reveal delay={180}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 26, alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 13, color: "var(--faint)" }}>{p.role}</span>
            <span style={{ width: 3, height: 3, borderRadius: 99, background: "var(--faint)" }} />
            <span className="mono" style={{ fontSize: 13, color: "var(--faint)" }}>{p.year}</span>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <p style={{ fontSize: 20, color: "var(--muted)", marginTop: 26, maxWidth: 620, lineHeight: 1.6 }}>{p.desc}</p>
        </Reveal>
        <Reveal delay={260}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
            {p.tags.map((t) => <span key={t} className="mono" style={{ fontSize: 12, color: "var(--faint)", border: "1px solid var(--line)", padding: "6px 12px", borderRadius: 99 }}>{t}</span>)}
          </div>
        </Reveal>
        {p.href && p.href !== "#" && (
          <Reveal delay={300}>
            <div style={{ marginTop: 34 }}>
              <Button as="a" href={p.href} target="_blank" icon={<Icon.arrowUR />}>{u.visitLive || "Visit live site"}</Button>
            </div>
          </Reveal>
        )}
      </section>

      <section className="wrap" style={{ padding: "20px 40px 80px" }}>
        {shots.length > 0 ? (
          <Reveal>
            <div className="pd-grid">
              {shots.map((s, i) => {
                const wide = i % 3 === 0;
                return (
                  <a key={s.src || i} href={s.src} target="_blank" rel="noopener noreferrer"
                    className={"pd-tile" + (wide ? " wide" : "")}>
                    {/* Grid shows a short top-crop preview (~1MP) so the tiles
                        paint fast; the <a> still opens the full screenshot.
                        First tile is the LCP — eager + high priority; the rest
                        stay lazy so they don't compete. */}
                    <img src={thumbSrc(s.src)} srcSet={thumbSrcSet(s.src)} sizes={sizes(wide ? 90 : 45)}
                      alt={s.label || p.title}
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchpriority={i === 0 ? "high" : "low"}
                      decoding="async" />
                    {s.label && <span className="pd-cap mono">{s.label}</span>}
                  </a>
                );
              })}
            </div>
          </Reveal>
        ) : (
          <div className="mono" style={{ textAlign: "center", padding: "60px 0", color: "var(--faint)" }}>// {u.noShots || "no screenshots yet"}</div>
        )}
      </section>

      <ContactFooter go={go} />

      <style>{`
        .pd-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; grid-auto-flow: dense; }
        /* content-visibility keeps off-screen tiles from decoding/painting
           their multi-megapixel screenshots until they're scrolled near;
           contain-intrinsic-size reserves the tile box so the scrollbar
           stays stable. */
        .pd-tile { position: relative; display: block; overflow: hidden; border-radius: 12px; border: 1px solid var(--line); height: 340px; cursor: zoom-in; background: var(--surface-2); transition: transform .45s var(--ease), box-shadow .45s var(--ease), border-color .3s; content-visibility: auto; contain-intrinsic-size: auto 340px; }
        .pd-tile.wide { grid-column: 1 / -1; height: 460px; contain-intrinsic-size: auto 460px; }
        .pd-tile img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%; display: block; transition: object-position 4.5s ease; }
        .pd-tile:hover { transform: translateY(-6px) scale(1.015); box-shadow: var(--shadow); border-color: var(--volt); z-index: 2; }
        .pd-tile:hover img { object-position: 50% 100%; }
        .pd-cap { position: absolute; left: 14px; bottom: 13px; font-size: 12px; letter-spacing: 0.04em; color: #fff; background: rgba(0,0,0,.6); padding: 6px 12px; border-radius: 99px; backdrop-filter: blur(4px); opacity: 0; transform: translateY(6px); transition: opacity .3s, transform .3s; z-index: 3; }
        .pd-tile:hover .pd-cap { opacity: 1; transform: none; }
        @media (max-width: 820px) {
          .pd-grid { grid-template-columns: 1fr; }
          .pd-tile, .pd-tile.wide { grid-column: auto; height: 280px; contain-intrinsic-size: auto 280px; }
        }
      `}</style>
    </div>
  );
}
