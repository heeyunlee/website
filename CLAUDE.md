# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (outputs to `out/`)
- `npm run lint` — ESLint via `next lint`
- `npm run deploy` — build + deploy to Firebase Hosting (`next build && firebase deploy --only hosting`)

## Architecture

Static export site (`output: "export"` in `next.config.ts`). No dynamic routes, server actions, or SSR — the entire site must be statically renderable. Images must stay unoptimized.

`lib/content/` is the single source of truth for all site content. Locale-invariant data (ids, URLs, tech tags, glyphs) lives in `lib/content/meta.ts`; all translatable copy lives in `lib/content/{en,ko,fr}.ts`, one file per locale, merged by `getContent(locale)` in `lib/content/index.ts`. Never hardcode copy in page components. To add a new UI string: add it to the `UIStrings` type in `lib/content/types.ts`, then to all three locale files — TypeScript errors until every locale has it.

## i18n

Three locales (`en`, `ko`, `fr`) defined in `lib/i18n/config.ts`. **Locale is client state, not a route** — there is one set of routes (`/`, `/projects`, …) and switching language never navigates or reloads. This is deliberate: per-locale routes (`/en`, `/ko`) forced Firebase into full-page reloads on switch, which broke the cross-language animations. `LocaleProvider` (`lib/i18n/locale-context.tsx`) holds the active locale; components read copy via `useContent()` and switch via `useLocale().setLocale()`. Switching just changes state, so `AnimatedText` animates the diff in place.

Locale is detected client-side (`?lang=` query → `localStorage` `preferred-locale` → browser language → default) and reflected back into `?lang=` via `replaceState` (dropped for the default locale). The pre-hydration inline script in `app/layout.tsx` sets `<html lang>` early — keep it in sync with `detectLocale()` and `lib/i18n/config.ts`. Old `/en`,`/ko`,`/fr` URLs are 301-redirected in `firebase.json`.

Because pages render client-side, the static HTML carries only the **default-locale** content and per-page titles (set via `pageMetadata()` in server `page.tsx` wrappers that render a `"use client"` `*-view.tsx`); translated copy and `<html lang>` are applied after hydration. Use plain paths in `<Link>` (`/projects`, not a localized href). Korean copy uses 해요체.

## TypeScript

Strict mode enabled. Use the `@/*` path alias for project-relative imports.

## Branch and PR conventions

- Branch names: `feat/<description>`, `fix/<description>`, `chore/<description>`
- Commit messages: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)

## Deployment

- CI/CD via GitHub Actions (`.github/workflows/deploy.yml`): pushes to `main` auto-deploy to Firebase Hosting.
- PR preview deployments via `.github/workflows/preview.yml`.
- Local deploy requires Firebase CLI + authentication (`firebase login`).
- `autoprefixer` must be in `dependencies` (not `devDependencies`) — Next.js font loader requires it at build time.
