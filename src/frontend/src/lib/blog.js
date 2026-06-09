/* blog.js — content-collection helpers shared by the blog Astro pages.
 *
 * Posts live at src/content/blog/<lang>/<slug>.md, so the collection entry id
 * is "<lang>/<slug>". These helpers recover the locale + slug and shape entries
 * into the plain, serialisable objects the React islands expect. */
import { getCollection } from 'astro:content';

/** Locale segment of an entry id ("en/foo" → "en"). */
export function langOf(entry) {
  return entry.id.split('/')[0];
}

/** Language-neutral slug of an entry id ("en/foo" → "foo"). */
export function slugOf(entry) {
  return entry.id.split('/').slice(1).join('/');
}

/** Published posts for a locale, newest first. */
export async function postsForLang(lang) {
  const posts = await getCollection('blog', (e) => !e.data.draft && langOf(e) === lang);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Frontmatter → plain card/header object for the React islands. */
export function toCard(entry) {
  const { title, description, date, tags, cover } = entry.data;
  return {
    slug: slugOf(entry),
    title,
    description,
    date: date.toISOString(),
    tags: tags ?? [],
    cover: cover ?? null,
  };
}
