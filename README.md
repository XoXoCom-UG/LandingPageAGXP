# Agentix Projects — presentation site

The public page for **AgXP**: an AI Consultant and an AI Coach working one
transformation project with you. It is a separate Next.js app from
[`agxp-frontend`](https://github.com/XoXoCom-UG/agxp-frontend) — no Supabase, no
auth, no API routes — but it deliberately shares that app's visual language.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## What is shared with the product, on purpose

| Here | Comes from |
| --- | --- |
| `lib/accent.ts` | `agxp-frontend/lib/accent.ts` — the same six accents, same hex values |
| dark `#1C1D1F` / light `#FAFAF9` tokens | `agxp-frontend/app/globals.css` |
| the mascots in `components/ui/mascot.tsx` | `agxp-frontend/components/layout/agent-mascot.tsx` — same SVG geometry, same three levels |
| the sneak peeks in `components/ui/peeks.tsx` | the visual block spec in `agxp-frontend/lib/deliverables.ts` |
| the five profiles in `components/sections/roster.tsx` | the seeded `agents` rows in `agxp-frontend/supabase/seed.sql` |
| the plain-language method lines ("What is missing") | `agxp-frontend/lib/method-labels.ts` — never the database's jargon |

If the accents or the mascot change in the product, change them here too — these
are copies, not imports.

## How the page is built

- **One fixed WebGL canvas** (`components/three/stage.tsx`) behind the whole
  document. The camera never moves; each scene is parked in a *slot* and rides
  its DOM section through the frame. Section positions are registered with a
  module-level store (`lib/scroll.ts`) that Lenis writes to once per frame, so
  the 3D and the text can never drift apart and nothing re-renders React at
  60fps.
- **Everything is drawn from `--primary` / `--primary-soft`.** The accent picker
  writes those two custom properties on `<html>`, and the page, the glass and
  the scene all re-colour together.
- **Dark and light are both first-class.** Additive blending adds nothing on a
  white page, so the glows and dust switch to normal blending and the line work
  switches to the deep tone in light mode.
- **It degrades.** `prefers-reduced-motion` stops the animation; a coarse
  pointer or a small screen drops the post-processing, the beams and most of the
  particles, and steps the whole 3D world back; and without JS the page renders
  fully visible rather than stuck at `opacity: 0`.

## Before this goes public

1. **The beta link.** `components/sections/beta.tsx` points at
   `mailto:beta@agentixprojects.com`. Swap `BETA_CONTACT` for the real waiting
   list once it exists — the section is written to be honest that the list is
   not open yet, so update the copy at the same time.
2. **Legal pages.** `components/ui/footer.tsx` links to `/impressum`,
   `/datenschutz` and `/agb`, which do not exist in this app yet. Either point
   them at the app's existing pages or port them across. A public marketing site
   operated from Germany without an Impressum is a real problem.
3. **`metadataBase`** in `app/layout.tsx` is set to
   `https://agentixprojects.com`. Correct it if the domain differs.
4. **Open Graph image.** There is none yet; social previews will fall back to
   text only.
5. **Check the roster is current.** `components/sections/roster.tsx` lists the
   five agents seeded in `supabase/seed.sql`. The live app already shows at
   least one more ("Digital Transformation Manager"), so the roster has grown
   past the seed — add any missing profiles here, and update the "5 agent
   profiles" figure in `components/sections/beta.tsx` with them.
