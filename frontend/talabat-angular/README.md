# Talabat Clone — Angular

This is an Angular 18 (standalone components + signals) port of the original
React/TanStack Start + shadcn/Radix "Talabat clone" food-delivery app.

## Stack

- **Angular 18**, standalone components, signals for state, the new
  `@if` / `@for` / `@let` control-flow syntax, `OnPush` change detection everywhere.
- **Tailwind CSS 3** for all layout/visual styling — the original design tokens
  (oklch colors, radii, shadows) were ported 1:1 into `src/styles.scss` and
  `tailwind.config.js`, so the look is unchanged.
- **PrimeNG 18** (Aura theme, re-skinned with the brand orange via
  `definePreset` in `app.config.ts`) supplies every interactive form control
  that the original built from Radix primitives: `p-select` (sort dropdown),
  `p-radioButton` (delivery method), `p-checkbox`, `p-password`
  (show/hide toggle built in), and `p-toast` / `MessageService` for
  notifications — nothing here uses a native `<select>`, `<input type="radio">`,
  or `window.alert`.
- **lucide-angular** for icons (1:1 equivalent of the original's `lucide-react`).
- **RxJS + HttpClient**, with a functional auth interceptor attaching the
  bearer token, replacing the original's manual `fetch` wrapper.

## Project layout

```
src/app/
  core/
    models/        # TS interfaces (Product, Basket, Order, ...)
    services/      # AuthService, BasketService, ProductsService, OrdersService, AccountService
    interceptors/  # auth.interceptor.ts
  shared/          # Header, Footer, MobileCartBar, ProductCard, EmptyState
  features/
    home/
    products/      # list (filters/sort/pagination) + detail
    basket/
    checkout/
    payment/
    orders/        # list + detail
    auth/          # login + register
    profile/
```

Each route is lazy-loaded via `loadComponent` in `app.routes.ts`.

## What changed from the React version (and why)

- **State management**: TanStack Query's cache/mutations were replaced with
  Angular **signals** on `BasketService`/`AuthService` (computed `count`,
  `subtotal`, `isAuthenticated`) plus plain RxJS calls for one-off requests.
- **Routing/search params**: TanStack Router's typed search params became
  Angular's `ActivatedRoute.queryParamMap`, read reactively via
  `toSignal(...)` in the products list page.
- **UI primitives**: shadcn/Radix components → PrimeNG equivalents (see above).
  Non-form elements (nav links, cards, chips, buttons that are really links)
  stayed as plain Tailwind-styled anchors/buttons, since there's no native
  widget being replaced there.
- **SSR**: the original ran on TanStack Start (SSR). This is a standard
  Angular CLI **SPA** build; add `@angular/ssr` later if server rendering is
  required.
- **Payment**: the original's mocked Stripe-like flow was kept as a mocked
  flow (demo card number, generated `paymentIntentId`), since no real payment
  gateway keys/config were present in the source project.

## Setup

```bash
npm install
npm start        # ng serve, http://localhost:4200
npm run build     # production build to dist/
```

The API base URL lives in `src/environments/environment.ts` — it currently
points at the same backend the original app targeted
(`https://talabatpub-api.runasp.net`). Update it if you point this at a
different backend.

## Notes / follow-ups

- `p-select` requires PrimeNG ≥18; if you pin an older PrimeNG version, swap
  it for `p-dropdown` (`DropdownModule`) — same props, different tag.
- Form validation is currently minimal (native `required`); wire up Angular
  **Reactive Forms** with `Validators` if you need field-level error messages.
- `AuthService.hasToken`/`isAuthenticated` are signals but are only
  re-evaluated on login/logout — there's no cross-tab sync; add a `storage`
  event listener if that's needed.
