/* BlogChrome.jsx — client island wrapping an Astro-rendered blog post.
 *
 * The post body is Markdown rendered by Astro (Shiki highlighting), passed in
 * as `children` via an Astro slot — it stays static HTML; only the Nav, the
 * article header and the ContactFooter are React. Mirrors BlogApp's chrome so
 * the post page is visually identical to the rest of the site. */
import { Icon } from './icons.jsx';
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

function PostHeader({ post, lang }) {
  const { C } = useT();
  const u = C.ui;
  return (
    <header className="wrap" style={{ paddingTop: 140, paddingBottom: 20, maxWidth: 820 }}>
      <a href={pathFor('blog', null, lang)} className="mono" style={{ fontSize: 13, color: 'var(--faint)', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.06em' }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon.arrowUR /></span> {u.navBlog}
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--volt-text)', letterSpacing: '0.1em' }}>{u.postedOn.toUpperCase()}</span>
        <span className="mono" style={{ fontSize: 13, color: 'var(--faint)' }}>{fmtDate(post.date, lang)}</span>
      </div>
      <h1 className="display" style={{ fontSize: 'clamp(34px,5vw,60px)', marginTop: 18, lineHeight: 1.1 }}>{post.title}</h1>
      <p style={{ fontSize: 19, color: 'var(--muted)', marginTop: 22, lineHeight: 1.6 }}>{post.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22 }}>
        {(post.tags || []).map((t) => <span key={t} className="mono" style={{ fontSize: 12, color: 'var(--faint)', border: '1px solid var(--line)', padding: '5px 10px', borderRadius: 99 }}>{t}</span>)}
      </div>
    </header>
  );
}

function Inner({ post, lang, langPaths, children }) {
  const chrome = useBlogChrome(lang, langPaths);
  return (
    <>
      <Nav route="blog" go={chrome.go} theme={chrome.theme} toggleTheme={chrome.toggleTheme} switchLang={chrome.switchLang} />
      <main className="page">
        <article>
          <PostHeader post={post} lang={lang} />
          <div className="wrap prose" style={{ maxWidth: 820, paddingBottom: 80 }}>
            {children}
          </div>
        </article>
        <ContactFooter />
      </main>
    </>
  );
}

export default function BlogChrome({ post, lang = 'en', langPaths = {}, children }) {
  return (
    <LangProvider initialLang={lang}>
      <Inner post={post} lang={lang} langPaths={langPaths}>{children}</Inner>
    </LangProvider>
  );
}
