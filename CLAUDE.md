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

Three locales (`en`, `ko`, `fr`) defined in `lib/i18n/config.ts`. All pages live under `app/[locale]/` and are statically exported per locale (`/en`, `/ko/projects`, …). The root layout (`app/layout.tsx`) is a passthrough; `app/[locale]/layout.tsx` renders `<html lang>`. Unprefixed URLs (`/`, `/projects`, …) are served by static detector pages in `public/` that redirect based on the visitor's stored preference (localStorage `preferred-locale`) or browser language — keep their inline script in sync with `lib/i18n/config.ts`. Internal links must use `localizeHref(locale, path)` from `lib/i18n/links.ts`. Korean copy uses 해요체. Explicit URLs always win — locale pages never auto-redirect.

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
