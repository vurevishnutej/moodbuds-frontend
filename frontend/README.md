# MoodBuds — React + TypeScript Frontend

Migration of the original MoodBuds HTML prototype into a production-structured
React + TypeScript + Vite frontend. Desktop is the priority (P0); mobile and
tablet layouts were intentionally left for a follow-up pass.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # type-check + production build
npm run lint      # oxlint over src/
```

## Architecture

```
src/
├── app/                 # App shell, routes, context providers (Cart, Wishlist, Toast, Quiz)
├── components/          # Shared UI: layout (Navbar/Footer), common (Modal, Icons, States)
├── data/                 # Typed static/mock data (moods, products, quiz, admin, profile…)
├── features/
│   ├── home/             # Hero slider, mood collection, find-your-mood, etc.
│   ├── moods/             # Mood service + palette theming hook
│   ├── products/          # Listing, detail, search — components/hooks/services/pages
│   ├── cart/               # Cart page + service (promo codes, totals, checkout)
│   ├── wishlist/           # Wishlist page + service
│   ├── quiz/                # Mood quiz modal + scoring service
│   ├── profile/             # Profile layout + Overview/Orders/Addresses/Coupons/Contact
│   └── admin/                # Admin console: 20 modules across 11 sections
├── services/
│   ├── api/               # (reserved for a shared HTTP client, once the backend exists)
│   └── storage/            # Typed localStorage wrapper (namespaced, JSON-safe)
├── styles/                 # legacy-desktop.css (ported verbatim from the original HTML),
│                            # variables.css, fonts.css, globals.css (new React-only bits)
└── types/                   # Domain models shared across features
```

## Mock API → real API

Every feature follows the same pattern:

```
Component -> Hook -> Service (interface) -> Mock implementation -> Mock data
```

For example, products:

- `features/products/services/productApi.ts` — the `ProductApi` interface (the future backend contract)
- `features/products/services/mockProductApi.ts` — implementation backed by `data/products.ts`
- `features/products/services/productService.ts` — the single import point components use

To integrate a real backend, implement `ProductApi` (etc.) against your REST/GraphQL
endpoints and swap the export in each `*Service.ts` facade — no component changes needed.
`.env.example` has placeholders (`VITE_API_BASE_URL`, `VITE_USE_MOCK_API`) for that switch.

Cart and wishlist persist to `localStorage` via `services/storage/storageService.ts`
(namespaced under `mb_*`) so state survives refreshes, matching the original behavior.

## Notes on fidelity vs. the original HTML

- **CSS**: the original's ~3,100 lines of desktop CSS were ported verbatim (same class
  names), so components intentionally reuse those exact class names rather than CSS
  Modules — this preserves the visual design pixel-for-pixel rather than a risky rewrite.
  Mobile-only CSS (<=767px) was excluded, since mobile is out of scope for this pass.
- **Product catalog**: reduced from 100 products/mood to 24/mood (216 total) for a
  snappier demo — same real name/brand/image pools from the original, deterministically
  generated (seeded), not placeholder data.
- **Mood transition screen**: the original's ~2.2s cinematic "loading the mood" screen
  was simplified to an instant route change with a fade-in; the mood-colored palette
  theming, hero band, and mood tab strip are all preserved on the listing page itself.
- **Auth**: the original supported a guest/logged-in toggle with demo login buttons.
  Since there's no backend, the app assumes a logged-in demo user (Vishnu Reddy)
  throughout — sign-in/sign-up UI was out of scope without a real auth service.
- **Admin console**: all 20 modules from the original are implemented using shared
  `AdminTable` / `AdminStats` / `AdminBadge` / `AdminToggle` components rather than
  one-off markup per module, per the "don't over-engineer, do reuse" guidance.

## What's next (P1/P2)

- Tablet/mobile responsive pass (the original's separate mobile SPA was not ported)
- Wire `VITE_USE_MOCK_API=false` to real `Http*Api` implementations once the backend exists
- Real authentication instead of the always-logged-in demo profile
