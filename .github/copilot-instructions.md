# CV Studio — Project Guidelines

## Architecture

- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4
- **UI:** shadcn/ui (new-york style) in `src/components/ui/`, Lucide icons, Framer Motion animations
- **State:** Zustand stores in `src/store/` (currently empty — all state is local `useState`)
- **Styling:** CSS variables in `src/app/globals.css`, `cn()` utility from `src/lib/utils.ts`
- **Language:** French-language app (`lang="fr"` in root layout)
- **Route groups:** `(marketing)`, `(auth)`, `(dashboard)`, `(admin)` — each with own layout
- **No backend yet:** No API routes, no database, no auth — frontend prototype with hardcoded mock data

## Code Style

- Files: `kebab-case.tsx` — Components: `PascalCase`
- All interactive components use `"use client"` — pages are server components composing client children
- Props interfaces defined inline or with `interface` before the component
- Mock data as `const` arrays/objects at top of component files
- Use `cn()` (clsx + tailwind-merge) for conditional class merging
- Import paths: `@/components/...`, `@/lib/...`, `@/hooks/...`, `@/store/...`

## Build and Test

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

No test framework is configured yet.

## Project Conventions

- **Color palette:** amber (primary), teal (accent), emerald (success), violet (letters), blue (interviews), rose (interview prep)
- **Custom CSS classes:** `.glass`, `.card-premium`, `.mesh-bg`, `.btn-gradient`, `.badge-active`, `.text-gradient-gold`, `.text-gradient-teal` — defined in `src/app/globals.css`
- **Typography:** Playfair Display (headings), DM Sans (body), DM Mono (code)
- **Animation pattern:** Framer Motion `whileInView` + staggered delays (`delay: i * 0.1`) for landing sections
- **Component structure:** Feature pages use two/three-panel layouts (main content + optional sidebars at 272px)
- **Dashboard header:** Use `DashboardHeader` from `src/components/dashboard/header.tsx` for all dashboard pages
- **Sidebar pattern:** Collapsible sidebar (260px ↔ 70px) with `usePathname()` for active state

## Key Dependencies (installed but not yet wired)

- `zustand` — for shared state (CV data, user session, settings)
- `react-hook-form` + `zod` — for form validation
- `recharts` — for dashboard charts
- `@vercel/analytics` — for production analytics

## Known Issues

- `src/store/`, `src/types/`, `src/hooks/` directories are empty — need Zustand stores, shared types, and custom hooks
- `/dashboard/cv-builder/new` and `/dashboard/help` routes have empty folders (no `page.tsx`)
- Duplicate `ThemeToggle` at `src/components/shared/theme-toggle.tsx` and `src/components/layout/theme-toggle.tsx`
- Auth form submits to nowhere — needs real auth provider integration
- CV editor `[id]` uses deprecated sync `params` — should use `use(params)` or `await params` for Next.js 16
