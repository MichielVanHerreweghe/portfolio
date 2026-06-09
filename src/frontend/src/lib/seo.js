/* seo.js — per-locale page metadata + Schema.org JSON-LD.
   ============================================================
   Single source of truth shared by the root (English) pages and the
   /[lang]/ localized pages, so <title>, description, canonical alternates and
   structured data stay in lockstep across en / nl / fr.

   URL model: English (the default locale) lives at the root (/, /about/, …);
   Dutch and French are path-prefixed (/nl/about/, /fr/about/). Every page is
   statically pre-rendered per locale, so each language is independently
   indexable — the previous client-side localStorage swap left nl/fr invisible
   to crawlers.
   ============================================================ */
import { I18N } from './i18n.jsx';

const SITE = 'https://nomaddigital.dev';
export const LOCALES = ['en', 'nl', 'fr'];
export const DEFAULT_LOCALE = 'en';

// og:locale uses xx_XX; Belgian Dutch/French for the local audience.
export const OG_LOCALE = { en: 'en_US', nl: 'nl_BE', fr: 'fr_BE' };

/** Absolute URL for a locale + logical path ('', 'about', 'portfolio',
 *  'projects/<slug>'). Default locale has no prefix; others are /<lang>. */
export function localeUrl(lang, logicalPath = '') {
  const prefix = lang === DEFAULT_LOCALE ? '' : `/${lang}`;
  const tail = logicalPath ? `/${logicalPath}/` : '/';
  return SITE + prefix + tail;
}

/** hreflang alternates (+ x-default → default locale) for a logical path.
 *  Each language maps to its own real URL — the signal Google needs to serve
 *  the right language to the right audience. */
export function alternatesFor(logicalPath = '') {
  return [
    ...LOCALES.map((l) => ({ hreflang: l, href: localeUrl(l, logicalPath) })),
    { hreflang: 'x-default', href: localeUrl(DEFAULT_LOCALE, logicalPath) },
  ];
}

// One canonical Person/WebSite entity across all locales (stable @id, canonical
// en url) so the three language pages enrich a single knowledge-graph node
// instead of competing as three separate people/sites.
const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;

function personNode(C, description) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: C.name,
    url: `${SITE}/`,
    image: `${SITE}/og.png`,
    jobTitle: C.role,
    description,
    address: { '@type': 'PostalAddress', addressCountry: 'BE', addressRegion: C.location },
    knowsAbout: C.stack,
    sameAs: C.socials.map((s) => s.href),
  };
}

/** Home: WebSite + Person, linked via publisher. */
export function homeSeo(lang) {
  const C = I18N[lang] || I18N[DEFAULT_LOCALE];
  const description = C.ui.heroIntro;
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE}/`,
    name: C.name,
    description,
    inLanguage: LOCALES,
    publisher: { '@id': PERSON_ID },
  };
  const personLd = { '@context': 'https://schema.org', ...personNode(C, description) };
  return {
    lang,
    path: '',
    title: `${C.name} — ${C.role}`,
    description,
    jsonLd: [websiteLd, personLd],
  };
}

/** About: ProfilePage wrapping the canonical Person, plus a breadcrumb. */
export function aboutSeo(lang) {
  const C = I18N[lang] || I18N[DEFAULT_LOCALE];
  const description = C.ui.aboutP1;
  const title = `${C.ui.navAbout} — ${C.name}`;
  const url = localeUrl(lang, 'about');
  const profileLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    name: title,
    description,
    inLanguage: lang,
    mainEntity: {
      ...personNode(C, description),
      worksFor: C.experience.map((e) => ({
        '@type': 'OrganizationRole',
        roleName: e.role,
        startDate: (e.period.match(/\d{4}/) || [undefined])[0],
        member: { '@type': 'Organization', name: e.org },
      })),
      alumniOf: C.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.org })),
      hasCredential: C.certifications.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        name: c.title,
        credentialCategory: 'Certification',
      })),
    },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: C.ui.navHome, item: localeUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: C.ui.navAbout, item: url },
    ],
  };
  return { lang, path: 'about', title, description, jsonLd: [profileLd, breadcrumbLd] };
}

/** Portfolio: CollectionPage + ItemList of the projects, plus a breadcrumb. */
export function portfolioSeo(lang) {
  const C = I18N[lang] || I18N[DEFAULT_LOCALE];
  const description = C.ui.portfolioIntro;
  const title = `${C.ui.navWork} — ${C.ui.portfolioH1a} ${C.ui.portfolioH1b}`;
  const url = localeUrl(lang, 'portfolio');
  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: title,
    description,
    url,
    inLanguage: lang,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: C.projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: localeUrl(lang, `projects/${p.slug || p.id}`),
      })),
    },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: C.ui.navHome, item: localeUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: C.ui.navWork, item: url },
    ],
  };
  return { lang, path: 'portfolio', title, description, jsonLd: [listLd, breadcrumbLd] };
}

/** Blog index: Blog + ItemList of the posts, plus a breadcrumb. `posts` is the
 *  locale's post list — plain objects { title, slug, ... } from the content
 *  collection (Astro build-time), sorted newest-first. */
export function blogSeo(lang, posts = []) {
  const C = I18N[lang] || I18N[DEFAULT_LOCALE];
  const description = C.ui.blogIntro;
  const title = `${C.ui.navBlog} — ${C.ui.blogH1a} ${C.ui.blogH1b}`;
  const url = localeUrl(lang, 'blog');
  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${url}#blog`,
    name: title,
    description,
    url,
    inLanguage: lang,
    author: { '@type': 'Person', '@id': PERSON_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: localeUrl(lang, `blog/${p.slug}`),
      })),
    },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: C.ui.navHome, item: localeUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: C.ui.navBlog, item: url },
    ],
  };
  return { lang, path: 'blog', title, description, jsonLd: [blogLd, breadcrumbLd] };
}

/** Blog post: BlogPosting + breadcrumb. `post` is the entry's frontmatter
 *  ({ title, description, date, cover, tags }); `slug` is language-neutral. */
export function blogPostSeo(lang, post, slug) {
  const C = I18N[lang] || I18N[DEFAULT_LOCALE];
  const description = post.description;
  const title = `${post.title} · ${C.name}`;
  const url = localeUrl(lang, `blog/${slug}`);
  // post.date is a Date (z.coerce.date); datePublished wants an ISO 8601 string.
  const datePublished =
    post.date instanceof Date ? post.date.toISOString() : post.date || undefined;
  const postLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: post.title,
    name: post.title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: lang,
    image: post.cover ? new URL(post.cover, SITE).href : `${SITE}/og.png`,
    ...(datePublished ? { datePublished } : {}),
    author: { '@type': 'Person', '@id': PERSON_ID, name: C.name, url: `${SITE}/` },
    publisher: { '@id': PERSON_ID },
    ...(post.tags && post.tags.length ? { keywords: post.tags.join(', ') } : {}),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: C.ui.navHome, item: localeUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: C.ui.navBlog, item: localeUrl(lang, 'blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };
  return {
    lang,
    path: `blog/${slug}`,
    title,
    description,
    image: post.cover,
    type: 'article',
    jsonLd: [postLd, breadcrumbLd],
  };
}

/** Project case-study: CreativeWork + breadcrumb. `project` is the localized
 *  project object (from I18N[lang].projects); `slug` is language-neutral. */
export function projectSeo(lang, project, slug) {
  const C = I18N[lang] || I18N[DEFAULT_LOCALE];
  const description = project.desc;
  // Middot rather than "by" so the brand reads naturally in all three locales.
  const title = `${project.title} — ${project.kind} · ${C.name}`;
  const url = localeUrl(lang, `projects/${slug}`);
  // project.year is a 4-digit string (e.g. "2025"); a bare year is valid ISO
  // 8601 for dateCreated. Skip when missing rather than fabricate precision.
  const dateCreated = project.year && /^\d{4}$/.test(project.year) ? project.year : undefined;
  const projectLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: project.title,
    description,
    url,
    inLanguage: lang,
    image: project.cover ? new URL(project.cover, SITE).href : undefined,
    ...(dateCreated ? { dateCreated } : {}),
    creator: { '@type': 'Person', '@id': PERSON_ID, name: C.name, url: `${SITE}/` },
    ...(project.href && project.href !== '#' ? { sameAs: project.href } : {}),
    ...(project.kind ? { genre: project.kind } : {}),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: C.ui.navHome, item: localeUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: C.ui.navWork, item: localeUrl(lang, 'portfolio') },
      { '@type': 'ListItem', position: 3, name: project.title, item: url },
    ],
  };
  return {
    lang,
    path: `projects/${slug}`,
    title,
    description,
    image: project.cover,
    type: 'article',
    jsonLd: [projectLd, breadcrumbLd],
  };
}
