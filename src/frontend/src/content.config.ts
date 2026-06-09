/* content.config.ts — Astro Content Collections.
   ============================================================
   The blog is authored as Markdown (Shiki code highlighting comes free) and
   rendered by Astro — Content Collections are a build-time concern, so their
   bodies are not available to the client-side React SPA. The blog therefore
   renders as real, indexable Astro pages that reuse the existing Nav and
   ContactFooter React components as islands.

   Trilingual model: one Markdown file per locale, living under a locale
   directory and sharing a slug:
     src/content/blog/en/<slug>.md
     src/content/blog/nl/<slug>.md
     src/content/blog/fr/<slug>.md
   The entry id is "<lang>/<slug>" — split on "/" to recover { lang, slug }.
   Sharing the slug across locales keeps the hreflang alternates aligned with
   the rest of the site (English at the root, /nl/ and /fr/ path-prefixed).
   ============================================================ */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Doubles as the meta description, the card excerpt and the JSON-LD
    // description, so keep it ~150–160 chars and self-contained.
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // Optional 1200×630 social-share / card image in /public
    // (e.g. "/blog/<slug>/cover.webp"). Falls back to the site OG image.
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
