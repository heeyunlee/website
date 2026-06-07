# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (outputs to `out/`)
- `npm run lint` — ESLint via `next lint`
- `npm run deploy` — build + deploy to Firebase Hosting (`next build && firebase deploy --only hosting`)

## Architecture

Static export site (`output: "export"` in `next.config.ts`). No dynamic routes, server actions, or SSR — the entire site must be statically renderable. Images must stay unoptimized.

`lib/site-content.ts` is the single source of truth for all site content (name, bio, experience, projects, contact links). Always edit this file to update site copy — never hardcode content in page components.

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
