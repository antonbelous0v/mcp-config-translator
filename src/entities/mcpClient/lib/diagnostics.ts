import type { TranslationDiagnostic } from '../model/mcpClient.types'
import type { McpServer } from '@/entities/mcpConfig/model/mcpConfig.types'

export function appendIgnoredFields(
	diagnostics: TranslationDiagnostic[],
	server: string,
	fields: string[],
) {
	if (!fields.length) {
		return
	}
	diagnostics.push({
		severity: 'warning',
		server,
		message: `${formatFields(fields)} ${fields.length === 1 ? 'is' : 'are'} client-specific and ${fields.length === 1 ? 'was' : 'were'} not copied.`,
	})
}

export function appendRootFields(
	diagnostics: TranslationDiagnostic[],
	root: Record<string, unknown>,
	serverKey: string,
) {
	const fields = Object.keys(root).filter(key => key !== serverKey)
	if (!fields.length) {
		return
	}
	diagnostics.push({
		severity: 'info',
		message: `Only ${serverKey} is converted. Top-level ${formatFields(fields)} ${fields.length === 1 ? 'was' : 'were'} left out.`,
	})
}

export function appendWhitespaceWarnings(
	diagnostics: TranslationDiagnostic[],
	server: McpServer,
) {
	for (const [field, value] of [
		['command', server.command],
		['url', server.url],
		['cwd', server.cwd],
	] as const) {
		if (value && value !== value.trim()) {
			diagnostics.push({
				severity: 'warning',
				server: server.name,
				message: `${field} contains leading or trailing whitespace and was preserved.`,
			})
		}
	}
}

function formatFields(fields: string[]) {
	return fields.map(field => `“${field}”`).join(', ')
}
