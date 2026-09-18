# MCP Config Translator

Browser-only converter for MCP server configurations used by Claude Code,
Claude Desktop, Codex, Cursor, Windsurf, VS Code, Gemini CLI, Cline, Roo Code,
Zed, OpenCode, and Pi. It detects the source format, validates the configuration,
normalizes it into a client-neutral model, reports compatibility differences,
and serializes the selected target format.

No configuration content leaves the browser.

## Development

Requires Node.js 24 and npm 11.

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run check
npm run test:e2e
```

`npm run check` runs ESLint, Stylelint, unit tests, TypeScript, production
builds, and unused-code analysis. The Playwright suite covers SSR, hydration,
accessibility, responsive layout, translation, clipboard behavior, and invalid
input handling.
