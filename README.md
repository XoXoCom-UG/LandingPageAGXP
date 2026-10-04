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

1. **Set `NEXT_PUBLIC_APP_URL` in Vercel** to the app's deployed origin, no
   trailing slash (e.g. `https://app.agentixprojects.com`). Log in, Continue
   with Google, Register and the Imprint / Privacy / Terms links all point
   there (`lib/links.ts`). Without it they resolve on the landing page's own
   domain and 404.
2. **The "100% private, no user data is visible" promise** in the hero comes
   from the strategy board. Make sure it is literally true before it goes
   public: the app stores conversations in Supabase, so anyone with database
   access can technically read them. In Germany an overstated privacy claim is
   a competition-law risk (UWG), not just a wording question.
3. **`metadataBase`** in `app/layout.tsx` is set to
   `https://agentixprojects.com`. Correct it if the domain differs.
4. **Open Graph image.** There is none yet; social previews will fall back to
   text only.
5. **Check the roster is current.** `components/sections/roster.tsx` lists the
   five agents seeded in `supabase/seed.sql`. The live app already shows at
   least one more ("Digital Transformation Manager") — add any missing
   profiles there and update the "5 agent profiles" figure in
   `components/sections/beta.tsx`.

## Hand-over to the app

The landing page signs nobody in itself: sessions live on the app's origin.

- **Log in** and **Continue with Google** open `APP_URL/login`. The user picks
  Google there — one extra click. To make the landing button start Google
  directly, the app's login page would need to honour e.g. `?provider=google`
  and call `signInWithOAuth` on load.
- **Register with Beta-Key** opens `APP_URL/login?mode=signup&key=AGXP-XXXXXX`.
  Today the app ignores both parameters, so the user lands on *sign in* and has
  to type the key again at the beta gate. Two small changes in `agxp-frontend`
  close that gap: the login page starts in sign-up mode when `mode=signup`, and
  stashes `key` (e.g. in `sessionStorage`) for `BetaGate` to pre-fill after the
  account exists.

## Emails

`emails/beta-invite.html` is the beta invitation, in the landing page's look,
written for Resend Templates (paste it via *Upload HTML*). It uses two template
variables:

| Variable | Value |
| --- | --- |
| `{{{BETA_KEY}}}` | the key, e.g. `AGXP-7K2M4P` |
| `{{{APP_URL}}}` | the app's origin, no trailing slash — the button opens `/login` |

It is table-based with inline styles on purpose: that is what Gmail and
Outlook actually render. Its images (mark, both mascots, the hero "core") are
PNG/JPG, because neither client shows SVG or WebGL. They live in
`public/email/`, are served from this site's domain, and are regenerated with
`python scripts/email-assets.py`.
