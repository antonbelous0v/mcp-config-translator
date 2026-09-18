import type { McpClientId } from '@/entities/mcpClient/model/mcpClient.types'
import { mcpClientIds } from '@/entities/mcpClient/model/mcpClient.catalog'

export interface TranslationPreferences {
	source: McpClientId
	targets: McpClientId[]
}

export const defaultTranslationPreferences: TranslationPreferences = {
	source: 'claude-code',
	targets: ['codex'],
}

const clientIds = new Set<string>(mcpClientIds)

export function normalizeTranslationPreferences(value: unknown): TranslationPreferences {
	if (!isRecord(value) || !isClientId(value.source) || !Array.isArray(value.targets)) {
		return defaultTranslationPreferences
	}
	const targets = [...new Set(value.targets.filter(isClientId))].filter(id => id !== value.source)
	return targets.length ? { source: value.source, targets } : defaultTranslationPreferences
}

function isClientId(value: unknown): value is McpClientId {
	return typeof value === 'string' && clientIds.has(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}
