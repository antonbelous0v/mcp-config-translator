# Contributing

## Before opening a pull request

1. Create a focused branch from `main`.
2. Keep changes inside the existing layer boundaries; `npm run lint` checks alias and relative imports.
   Colocate UI styles as matching `*.module.css` files; the same command runs Stylelint and the style-file contract.
3. Add the smallest test that would fail without the change.
4. Run the same gates as CI:

```bash
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
```

## Pull requests

Explain the problem, the chosen solution, and any user-visible or operational risk. Keep unrelated refactors separate and update documentation when commands, architecture, or public behavior changes.

Do not commit secrets, generated build output, Playwright reports, or local environment files.
