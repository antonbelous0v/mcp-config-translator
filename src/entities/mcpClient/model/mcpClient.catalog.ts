import type { McpClientDefinition, McpClientId } from './mcpClient.types'

export const mcpClients: Record<McpClientId, McpClientDefinition> = {
	'claude-code': {
		name: 'Claude Code',
		format: 'JSON',
		path: '.mcp.json',
		filename: '.mcp.json',
		supportedTransports: new Set(['stdio', 'http', 'sse', 'ws']),
		serverNamePattern: /^[\w-]+$/u,
	},
	'claude-desktop': {
		name: 'Claude Desktop',
		format: 'JSON',
		path: 'claude_desktop_config.json',
		filename: 'claude_desktop_config.json',
		supportedTransports: new Set(['stdio', 'http', 'sse']),
	},
	'codex': {
		name: 'Codex',
		format: 'TOML',
		path: '.codex/config.toml',
		filename: 'config.toml',
		supportedTransports: new Set(['stdio', 'http']),
	},
	'cursor': {
		name: 'Cursor',
		format: 'JSON',
		path: '.cursor/mcp.json',
		filename: 'mcp.json',
		supportedTransports: new Set(['stdio', 'http', 'sse']),
	},
	'windsurf': {
		name: 'Windsurf',
		format: 'JSON',
		path: '~/.codeium/windsurf/mcp_config.json',
		filename: 'mcp_config.json',
		supportedTransports: new Set(['stdio', 'http', 'sse']),
	},
	'vscode': {
		name: 'VS Code',
		format: 'JSON',
		path: '.vscode/mcp.json',
		filename: 'mcp.json',
		supportedTransports: new Set(['stdio', 'http', 'sse']),
	},
	'gemini-cli': {
		name: 'Gemini CLI',
		format: 'JSON',
		path: '.gemini/settings.json',
		filename: 'settings.json',
		supportedTransports: new Set(['stdio', 'http', 'sse']),
	},
	'cline': {
		name: 'Cline',
		format: 'JSON',
		path: '~/.cline/mcp.json',
		filename: 'mcp.json',
		supportedTransports: new Set(['stdio', 'http', 'sse']),
	},
	'roo-code': {
		name: 'Roo Code',
		format: 'JSON',
		path: '.roo/mcp.json',
		filename: 'mcp.json',
		supportedTransports: new Set(['stdio', 'http', 'sse']),
	},
	'zed': {
		name: 'Zed',
		format: 'JSON',
		path: '~/.config/zed/settings.json',
		filename: 'settings.json',
		supportedTransports: new Set(['stdio', 'http']),
	},
	'opencode': {
		name: 'OpenCode',
		format: 'JSON',
		path: 'opencode.jsonc',
		filename: 'opencode.jsonc',
		supportedTransports: new Set(['stdio', 'http']),
	},
	'pi': {
		name: 'Pi',
		format: 'JSON',
		path: '.pi/mcp.json',
		filename: 'mcp.json',
		supportedTransports: new Set(['stdio', 'http', 'sse']),
	},
}

export const mcpClientIds = Object.keys(mcpClients) as McpClientId[]
