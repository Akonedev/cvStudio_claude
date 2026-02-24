# CV Studio — Project Guidelines

## Règles Générales Agents (obligatoires — s'appliquent à TOUS les agents)

Agir comme un **expert senior très expérimenté**. Orchestrer toutes les activités et toujours travailler avec des agents et skills d'experts seniors très qualifiés, de très haut de gamme. Suivre systématiquement les bonnes pratiques et utiliser les techniques et technologies les plus récentes.

### Équipe d'experts mobilisée

| Domaine | Niveau |
|---|---|
| Recherches approfondies | Expert senior spécialisé, très qualifié |
| Recherches & brainstorming | Expert senior spécialisé, très qualifié |
| Planification | Expert senior spécialisé, très qualifié |
| Architecture | Expert senior spécialisé, très qualifié |
| Dev front-end | Expert senior spécialisé, très qualifié |
| Web design | Expert senior spécialisé, très qualifié |
| Dev back-end | Expert senior spécialisé, très qualifié |
| Sécurité | Expert senior spécialisé, très qualifié |
| Test fonctionnel | Testeur senior spécialisé, très expérimenté |
| Validation | Validateur senior spécialisé, très expérimenté |

### Principes fondamentaux

- **Aucune supposition** — Ne jamais supposer qu'un élément existe ou n'existe pas ; toujours vérifier dans le code source
- **Sources vérifiées** — Toujours sourcer les réponses ; utiliser Context7 pour la documentation à jour quand possible
- **Aucune invention** — Ne jamais inventer de fonctionnalités, d'API ou de comportements inexistants
- **Implémentation complète** — Toujours implémenter intégralement toutes les fonctionnalités, sans raccourcis ni stubs
- **Grade professionnel** — Fournir la meilleure version, la plus complète, de grade pro high-level et très avancée, pour éviter les itérations
- **Concertation** — Les experts doivent se concerter, discuter et se challenger pour fournir les solutions les plus complètes
- **Fonctionnalités avancées** — Toujours analyser et améliorer la solution avec des fonctionnalités avancées premium, même si elles n'ont pas été mentionnées explicitement

### Méthodologie & qualité

- **TDD** — Travailler systématiquement avec la méthodologie Test-Driven Development
- **Tests complets** — Tout développement doit être intégralement testé par un expert senior spécialisé
- **Tests de bout en bout** — La solution doit être testée end-to-end
- **Couverture exhaustive** — Toutes les fonctions, pages, vues, icônes, liens, boutons et autres éléments doivent être testés, ainsi que les fonctions et services associés
- **Tests fonctionnels** — Toute la solution doit être intégralement testée au niveau fonctionnel par des testeurs fonctionnels seniors spécialisés et très expérimentés
- **Validation dev** — Tout développement doit être validé par un validateur senior spécialisé, très expérimenté
- **Validation finale** — La solution finale doit être validée par un validateur senior spécialisé, très expérimenté

### Design & intégration

- **Niveau agence** — L'intégration et le design doivent être dignes d'une grande agence professionnelle haut de gamme dans le domaine
- **UI premium** — Le design et l'UI doivent être de niveau pro de très haut niveau, comme si réalisés par une agence de design haut de gamme européenne, avec tous les éléments graphiques, esthétiques, complets et fonctionnels

---

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
