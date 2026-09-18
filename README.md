# MCP Config Translator

Browser-only converter for MCP server configurations used by Claude Code,
Claude Desktop, Codex, Cursor, Windsurf, VS Code, Gemini CLI, Cline, Roo Code,
Zed, OpenCode, and Pi. It detects the source format, validates the configuration,
normalizes it into a client-neutral model, reports compatibility differences,
and serializes the selected target format.

No configuration content leaves the browser.

## Adding a client

If you need a client that is not supported yet, add an adapter for it:

1. Add the id to the `McpClientId` union in
   `src/entities/mcpClient/model/mcpClient.types.ts`.
2. Add a `McpClientDefinition` entry to `mcpClients` in
   `src/entities/mcpClient/model/mcpClient.catalog.ts` (name, format, config
   path, supported transports).
3. Create `src/entities/mcpClient/adapters/<id>.adapter.ts` implementing
   `McpClientAdapter` (`decode`/`encode`). Reuse an existing codec from
   `src/entities/mcpClient/codecs/` with a format dialect when possible; add a
   new codec only when the format differs.
4. Register the adapter in
   `src/entities/mcpClient/adapters/mcpClientAdapters.entry.ts`.
5. Extend `detectMcpClient` in
   `src/entities/mcpClient/model/detectMcpClient.ts` when the format should be
   auto-detected, and add a matching test.

See [CONTRIBUTING.md](CONTRIBUTING.md) to open a pull request.

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
