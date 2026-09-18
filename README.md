# Frontend Starter

A production-oriented React starter for applications that need server rendering, explicit architectural boundaries, and a small but serious delivery pipeline.

It uses React Router Framework Mode for SSR instead of a hand-written server. The removable reference application shows local persistence and a real JSONPlaceholder request flowing through pages, features, entities, repositories, services, view-model stores, DI, and UI.

## Stack

- React 19 and TypeScript
- React Router Framework Mode with SSR
- Vite
- Reatom stable
- Mantine UI
- SSR-compatible file-based SVG sprite generation
- Needle DI with one container per rendered application
- Shared HTTP client over native Fetch with explicit repository boundaries
- Vitest and Playwright
- ESLint architecture rules, Stylelint, Knip, lint-staged, Husky, and GitHub Actions

## Quick start

Requirements: Node.js 24 and npm 11.

```bash
npm ci
npm run dev
```

The development server is available at `http://localhost:5173` with SSR, HMR, and route type generation.

Configure a new application interactively:

```bash
npm run template:setup
```

The setup is intentionally one-way. It configures the package/display name, SEO description, document language, Mantine color scheme and primary color, and whether to retain the working example. Every choice also has a non-interactive flag:

```bash
npm run template:setup -- --yes --name my-product --title "My Product" \
  --description "My product description." --lang en \
  --color-scheme auto --primary-color violet --demo remove
```

Run `npm run template:setup -- --help` for the complete CLI reference.

## Architecture

```text
src/
├── app/          application providers, DI composition, and root layout
├── pages/        React Router route modules and page composition
├── widgets/      reusable page-level UI blocks
├── features/     user-facing use cases
├── entities/     domain models, services, repositories, stores, and entity UI
└── shared/       framework-independent infrastructure and utilities
```

Higher layers may depend on lower layers, never the reverse. ESLint resolves both aliases and relative imports before enforcing the boundaries:

- `shared` cannot import application or domain layers;
- `entities` can depend only on `entities` and `shared`;
- `features` cannot depend on `app`, `pages`, or `widgets`;
- `widgets` cannot depend on `app` or `pages`.

Types stay next to the code they describe. Create a separate `types.ts` only when it improves a module, not to satisfy a repository-wide ritual.

### Routing and SSR

[`src/routes.ts`](src/routes.ts) uses React Router's official file-route convention to discover route modules under `src/pages` during development, type generation, and builds. There is no browser-side directory scan or route registry to maintain:

```text
src/pages/
├── _index/route.tsx                 /
├── about/route.tsx                  /about
└── products.$productId/route.tsx    /products/:productId
```

Keep route-local components and tests next to `route.tsx`; only the route module is discovered. The `@/` alias keeps cross-layer imports stable, while relative imports remain local to a route folder.

Add an optional `navigation.ts` beside a route when it should appear in the primary navigation. [`src/app/navigation.ts`](src/app/navigation.ts) discovers only these small metadata modules at build time, so adding a page never requires editing a central registry and does not eagerly import route code.

React Router owns the development server, client/server builds, HTTP responses, hydration, route errors, and production serving. [`src/root.tsx`](src/root.tsx) owns only the document shell and application providers. This keeps transport concerns out of the domain layers and avoids maintaining a second, partial web framework in the repository.

### Metadata and response security

React 19 hoists native `<title>`, `<meta>`, and `<link>` elements into the document head during SSR, so route modules can own their metadata without another head manager. The example includes description and social metadata; add canonical URLs, robots rules, and share images only when the deployment origin and assets are real.

The root route sends safe, origin-independent browser headers. Content Security Policy, HSTS, cross-origin isolation, and feature policies belong in deployment configuration once the product's domains, embeds, OAuth flows, and third-party scripts are known.

### Dependency injection

[`src/app/container/container.ts`](src/app/container/container.ts) discovers `*.provider.ts` modules and builds a fresh container for each server render. The hydrated browser application keeps its container for the lifetime of the app. Tests can replace bindings through a child container.

Each discovered module named-exports a `provider` function. `useService` is limited to application/page composition; lower layers receive constructor dependencies or narrow feature-injector values. Product metadata and theme defaults live together in [`src/shared/config.ts`](src/shared/config.ts); `template:setup` writes them from validated CLI answers.

### SVG icons

Put repository-owned icons under `src/shared/assets/icons`. The maintained `vite-plugin-svg-icons-ng` successor compiles them into a cached sprite, fails the build on broken or duplicate icons, and exposes the sprite to the React Router document shell during SSR. Render an icon with the accessible-by-default [`SvgIcon`](src/shared/ui/SvgIcon.tsx):

```tsx
<>
	<SvgIcon name="app" />
	<SvgIcon name="actions-save" aria-label="Save" />
</>
```

Decorative icons are hidden from assistive technology; providing `aria-label` gives the SVG image semantics. Nested folders become name prefixes. The sprite is present in server HTML, so icons do not wait for hydration or an extra request.

### State

The example uses the stable Reatom packages. Stores stay in the owning entity and expose state and operations to feature entries. The entry subscribes through `reatomComponent` and maps the store to props-driven UI; leaf UI does not resolve stores, services, repositories, or injectors.

### Styling

Component and route styles use colocated CSS Modules whose basename matches their owner:

```text
PostCard.tsx
PostCard.module.css

home.page.tsx
home.page.module.css
```

Import the module as `styles` and use camelCase local names (`styles.requestStatus`). A stylesheet may style only its owner's markup; do not import another feature's or entity's private module. Pass module classes through Mantine's `className`/`classNames` APIs when styling component slots.

[`src/index.css`](src/index.css) is the sole application-global stylesheet. Keep only design tokens, reset/base rules, accessibility defaults, and intentional third-party integration overrides there. Shared visual values belong in CSS custom properties; component-specific values stay local until another real consumer exists.

Plain CSS is the default because Vite supports CSS Modules directly and modern CSS already provides variables, nesting-compatible selectors, container queries, and color functions. Do not install Sass pre-emptively. If a product genuinely needs Sass, adopt `.module.scss` consistently and extend the style toolchain in the same change instead of mixing unlinted formats.

`npm run lint:styles` enforces CSS quality, camelCase module classes, the `.module.css` suffix, colocation, and owner/file basename matching. The same gate runs in CI and pre-commit checks.

### Remote data flow

The posts example deliberately keeps the network slice concrete and removable:

```text
page composition
  → posts feature
    → Reatom view-model store
      → domain service and DTO mapper
        → repository port
          → JSONPlaceholder adapter
```

The shared HTTP client owns URL construction, query serialization, headers, JSON parsing, and HTTP failure handling. The entity adapter declares only the endpoint and DTO response contract. The service converts DTOs into the domain model, so transport fields never reach UI. Product-specific authentication, retries, runtime schemas, and caching remain opt-in because their policies depend on the real backend.

### AI architecture guidance

[`skills/frontend-architecture/SKILL.md`](skills/frontend-architecture/SKILL.md) is the compact source of truth for coding agents. It defines layer ownership, the DTO/repository/service/view-model flow, and the boundary between useful dependency injection and unnecessary indirection. [`AGENTS.md`](AGENTS.md) points repository-aware agents to it automatically.

`npm run lint:architecture` protects the non-demo architecture kernel and rejects feature UI that imports orchestration internals. ESLint separately enforces the FSD dependency direction. This keeps the reference implementation and the written guidance from drifting apart.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the React Router SSR development server |
| `npm run typecheck` | Generate route types and run TypeScript |
| `npm run build` | Type-check and create production client/server builds |
| `npm start` | Serve the production build |
| `npm test` | Run Vitest in watch mode |
| `npm run test:unit` | Run unit and integration tests once |
| `npm run test:e2e` | Build and run Playwright SSR/hydration tests |
| `npm run lint` | Run cached, type-aware ESLint with zero warnings |
| `npm run lint:architecture` | Verify the DI kernel and feature UI isolation |
| `npm run lint:fix` | Apply safe ESLint fixes |
| `npm run lint:styles` | Enforce Stylelint and the colocated CSS Module contract |
| `npm run knip` | Find unused files, exports, and dependencies |
| `npm run check` | Run the local CI quality gate |
| `npm run template:setup` | Configure the product interactively or through flags |

## Quality gates

- Vitest collects colocated application tests and tooling tests under `scripts/**/__tests__`.
- Playwright verifies usable server-rendered HTML with JavaScript disabled, a stable initial color scheme, route errors, clean hydration, the live API success/error flow, keyboard bypass navigation, and automated accessibility checks with Axe.
- Knip keeps dead files, exports, and dependencies out of the template.
- Stylelint and the file-contract check reject invalid CSS and unscoped local styles.
- Pre-commit checks operate only on staged files; the full gate runs in CI.
- GitHub Actions runs lint, unit tests, type checking, the production build, and Chromium E2E tests.
- Dependabot proposes weekly npm and GitHub Actions updates.

Run the complete local gate before opening a pull request:

```bash
npm run check
npm run test:e2e
```

### E2E organization

Group scenarios by product area instead of putting every test in one directory:

```text
e2e/
├── smoke/                 universal SSR, errors, hydration, and accessibility checks
├── checkout/              checkout journeys
└── account-settings/      account journeys
```

Use `*.spec.ts` files and Playwright's role- or label-based locators. Keep a workflow in the spec until selectors or actions are genuinely shared by several scenarios; only then extract a fixture or page object. The removable example follows the same rule in `e2e/template-catalog/`, and clean setup removes that directory while preserving the universal smoke suite.

## Production

```bash
npm run build
PORT=3000 npm start
```

Deploy `build/`, `package.json`, `package-lock.json`, and production dependencies to any Node.js host. Use a platform-specific React Router adapter only when the target platform requires one.

## Deliberate omissions

There is no auth framework, mock server, analytics SDK, runtime schema library, or environment schema in the base template. Add those after the product has a real contract for them; speculative infrastructure makes starters harder to remove and easier to misuse.

- A service worker needs an explicit offline/update/cache policy and tests; a generic cache can serve stale SSR or authenticated responses.
- Partytown only helps after real third-party scripts measurably block the main thread.
- Unhead duplicates React 19 and React Router metadata handling.
- Helmet is Express middleware; this template uses React Router response headers and has no custom Express server.

## Contributing and security

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the change workflow. Report vulnerabilities according to [`SECURITY.md`](SECURITY.md), never in a public issue.
