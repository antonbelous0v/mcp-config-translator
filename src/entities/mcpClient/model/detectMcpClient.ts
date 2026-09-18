import type { ParseError } from 'jsonc-parser'
import type { McpClientId } from './mcpClient.types'
import { parse } from 'jsonc-parser'

export function detectMcpClient(raw: string): McpClientId | null {
	const text = raw.trim()
	if (!text) {
		return null
	}
	if (/^\s*\[mcp_servers(?:\.|\])/u.test(text)) {
		return 'codex'
	}

	const root = parseRecord(text)
	if (!root) {
		return null
	}
	if (isRecord(root.mcp) && isRecord(root.mcp.servers)) {
		return 'opencode'
	}
	if (isRecord(root.servers)) {
		return 'vscode'
	}
	if (isRecord(root.context_servers)) {
		return 'zed'
	}
	if (!isRecord(root.mcpServers)) {
		return null
	}

	const servers = Object.values(root.mcpServers).filter(isRecord)
	if (servers.some(server => 'transport' in server || 'directTools' in server || 'lifecycle' in server)) {
		return 'pi'
	}
	if (servers.some(server => 'serverUrl' in server)) {
		return 'windsurf'
	}
	if (servers.some(server => 'httpUrl' in server || 'trust' in server || 'includeTools' in server || 'excludeTools' in server)) {
		return 'gemini-cli'
	}
	if (servers.some(server => 'autoApprove' in server || server.type === 'streamableHttp')) {
		return 'cline'
	}
	if (servers.some(server => 'alwaysAllow' in server || 'disabledTools' in server || 'watchPaths' in server)) {
		return 'roo-code'
	}
	if (servers.some(server => 'type' in server)) {
		return 'claude-code'
	}
	return 'cursor'
}

function parseRecord(raw: string) {
	try {
		const errors: ParseError[] = []
		const value: unknown = parse(raw, errors, { allowTrailingComma: true })
		return errors.length === 0 && isRecord(value) ? value : null
	}
	catch {
		return null
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}
