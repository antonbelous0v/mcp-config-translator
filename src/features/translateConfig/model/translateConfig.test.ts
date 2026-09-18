import { describe, expect, it } from 'vitest'
import { mcpClientIds } from '@/entities/mcpClient/model/mcpClient.catalog'
import { McpConfigError } from '@/entities/mcpConfig/model/McpConfigError'
import { configExamples } from './examples'
import { translateConfig } from './translateConfig'

describe('translateConfig', () => {
	it('converts Claude JSON to Codex TOML', () => {
		const result = translateConfig(configExamples['claude-code'], 'claude-code', 'codex')

		expect(result.serverCount).toBe(2)
		expect(result.output).toContain('[mcp_servers.filesystem]')
		expect(result.output).toContain('[mcp_servers.project-api.http_headers]')
		expect(result.output).toMatch(/Authorization = "Bearer \$\{API_TOKEN\}"/)
	})

	it('converts Codex TOML back to Cursor JSON', () => {
		const result = translateConfig(configExamples.codex, 'codex', 'cursor')
		expect(result.output).toContain('"command": "npx"')
		expect(result.output).toContain('"url": "https://mcp.example.com/mcp"')
		expect(result.output).toMatch(/Bearer \$\{API_TOKEN\}/)
	})

	it('uses serverUrl for Windsurf remote servers', () => {
		const result = translateConfig(configExamples.cursor, 'cursor', 'windsurf')
		expect(result.output).toContain('"serverUrl": "https://mcp.example.com/mcp"')
		expect(result.output).not.toContain('"url": "https://mcp.example.com/mcp"')
	})

	it('reports client-specific fields instead of copying them silently', () => {
		const source = JSON.stringify({
			mcpServers: {
				local: { command: 'node', args: ['server.js'], alwaysAllow: ['read_file'] },
			},
		})

		const result = translateConfig(source, 'claude-code', 'cursor')
		expect(result.diagnostics[0]?.message).toContain('alwaysAllow')
	})

	it('rejects invalid field types', () => {
		const source = JSON.stringify({ mcpServers: { local: { command: 'node', args: '--bad' } } })
		expect(() => translateConfig(source, 'cursor', 'codex')).toThrow('args must be an array of strings')
	})

	it('rejects ambiguous and unsupported transports', () => {
		const mixed = JSON.stringify({
			mcpServers: { mixed: { command: 'node', url: 'https://example.com/mcp' } },
		})
		const sse = JSON.stringify({
			mcpServers: { events: { type: 'sse', url: 'https://example.com/sse' } },
		})

		expect(() => translateConfig(mixed, 'cursor', 'codex')).toThrow('both command and URL')
		expect(() => translateConfig(sse, 'claude-code', 'codex')).toThrow('does not support the sse transport')
	})

	it('returns a useful syntax error for malformed JSON', () => {
		expect(() => translateConfig('{\n  nope', 'cursor', 'codex')).toThrow(McpConfigError)
		expect(() => translateConfig('{\n  nope', 'cursor', 'codex')).toThrow(/line 2/)
	})

	it.each(mcpClientIds.flatMap(source => mcpClientIds
		.filter(target => target !== source)
		.map(target => [source, target] as const)))('converts %s to %s', (source, target) => {
		const result = translateConfig(configExamples[source], source, target)
		expect(result.serverCount).toBe(2)
		expect(result.output.trim()).not.toBe('')
	})
})
