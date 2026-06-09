/* BlogApp.jsx — client island for the blog index.
 *
 * Mirrors PortfolioPage: a hero with a tag filter and a card grid. Receives
 * `posts` (plain, serialisable frontmatter from the content collection) as a
 * prop from the Astro page — the SPA never owns this data. Post links are real
 * <a href> navigations (the posts are Astro-rendered Markdown pages), so unlike
 * ProjectCard there's no click interception. Reuses the existing Nav +
 * ContactFooter via LangProvider so the chrome is identical to the rest of the
 * site. */
import { useState } from 'react';
import { Icon } from './icons.jsx';
import { Reveal, Kicker } from './primitives.jsx';
import { Nav } from './Nav.jsx';
import { ContactFooter } from './ContactFooter.jsx';
import { LangProvider, useT } from '../lib/i18n.jsx';
import { pathFor } from '../lib/routes.js';
import { useBlogChrome } from './useBlogChrome.jsx';

function fmtDate(iso, lang) {
  try {
    return new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function PostCard({ p, big, lang }) {
  const { C } = useT();
  const u = C.ui;
  const href = pathFor('post', p.slug, lang);
  return (
    <Reveal>
      <a href={href} className="card post-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', color: 'var(--text)', height: '100%' }}>
        <div className="post-cover" style={{ position: 'relative', height: big ? 300 : 200, background: 'var(--surface-2)', overflow: 'hidden' }}>
          {p.cover ? (
            <img src={p.cover} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="mono" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--faint)', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {(p.tags[0] || u.navBlog)}
            </div>
          )}
        </div>
        <div style={{ padding: big ? '28px 30px' : '22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--volt-text)', letterSpacing: '0.1em' }}>{(p.tags[0] || 'POST').toUpperCase()}</span>
            <span style={{ width: 3, height: 3, borderRadius: 99, background: 'var(--faint)' }} />
            <span className="mono" style={{ fontSize: 12, color: 'var(--faint)' }}>{fmtDate(p.date, lang)}</span>
          </div>
          <h3 style={{ fontSize: big ? 30 : 22, lineHeight: 1.2 }}>{p.title}</h3>
          <p style={{ color: 'var(--muted)', fontSize: big ? 16 : 15, lineHeight: 1.6, marginTop: 12, flex: 1 }}>{p.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, gap: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {p.tags.map((t) => <span key={t} className="mono" style={{ fontSize: 12, color: 'var(--faint)', border: '1px solid var(--line)', padding: '5px 10px', borderRadius: 99 }}>{t}</span>)}
            </div>
            <span className="mono post-read" style={{ fontSize: 13, color: 'var(--volt-text)', display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
              {u.readMore} <Icon.arrowUR />
            </span>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

function BlogHero({ filter, setFilter, tags }) {
  const { C } = useT();
  const u = C.ui;
  const pills = [{ key: 'all', label: u.filterAll }, ...tags.map((t) => ({ key: t, label: t }))];
  return (
    <section className="wrap" style={{ paddingTop: 160, paddingBottom: 20 }}>
      <Reveal><Kicker>{u.blogKicker}</Kicker></Reveal>
      <Reveal delay={70} as="h1" className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', marginTop: 26 }}>
        {u.blogH1a}<br />{u.blogH1b}
      </Reveal>
      <Reveal delay={150}>
        <p style={{ fontSize: 20, color: 'var(--muted)', marginTop: 26, maxWidth: 600, lineHeight: 1.6 }}>{u.blogIntro}</p>
      </Reveal>
      {tags.length > 0 && (
        <Reveal delay={210}>
          <div style={{ display: 'flex', gap: 10, marginTop: 38, flexWrap: 'wrap' }}>
            {pills.map((t) => (
              <button key={t.key} onClick={() => setFilter(t.key)} className="mono filter-pill"
                style={{ fontSize: 13, letterSpacing: '0.06em', padding: '10px 16px', borderRadius: 99, border: '1px solid var(--line)', background: filter === t.key ? 'var(--volt)' : 'transparent', color: filter === t.key ? '#0B0B0C' : 'var(--muted)', fontWeight: 600, transition: 'all .2s' }}>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}

function BlogIndex({ posts, lang }) {
  const { C } = useT();
  const u = C.ui;
  const [filter, setFilter] = useState('all');
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const shown = filter === 'all' ? posts : posts.filter((p) => p.tags.includes(filter));
  const [featured, ...rest] = shown;

  return (
    <div className="page">
      <BlogHero filter={filter} setFilter={setFilter} tags={tags} />
      <section className="wrap" style={{ padding: '30px 40px 80px' }}>
        {featured && <div style={{ marginBottom: 20 }}><PostCard p={featured} big lang={lang} /></div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }} className="post-grid">
          {rest.map((p) => <PostCard key={p.slug} p={p} lang={lang} />)}
        </div>
        {shown.length === 0 && (
          <div className="mono" style={{ textAlign: 'center', padding: '80px 0', color: 'var(--faint)' }}>// {u.noPosts} "{filter}"</div>
        )}
      </section>
      <ContactFooter />
      <style>{`
        .post-card { transition: transform .35s var(--ease), border-color .35s; }
        .post-card:hover { transform: translateY(-6px); border-color: var(--volt); }
        .post-card:hover .post-read { gap: 11px; }
        .post-cover img { transition: transform .5s var(--ease); }
        .post-card:hover .post-cover img { transform: scale(1.04); }
        .filter-pill:hover { border-color: var(--volt); }
        @media (max-width:820px){ .post-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Inner({ posts, lang, langPaths }) {
  const chrome = useBlogChrome(lang, langPaths);
  return (
    <>
      <Nav route="blog" go={chrome.go} theme={chrome.theme} toggleTheme={chrome.toggleTheme} switchLang={chrome.switchLang} />
      <main>
        <BlogIndex posts={posts} lang={lang} />
      </main>
    </>
  );
}

export default function BlogApp({ posts = [], lang = 'en', langPaths = {} }) {
  return (
    <LangProvider initialLang={lang}>
      <Inner posts={posts} lang={lang} langPaths={langPaths} />
    </LangProvider>
  );
}
