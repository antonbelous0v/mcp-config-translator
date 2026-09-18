import type { ConfigTranslation, McpClientId } from '@/entities/mcpClient/model/mcpClient.types'
import { mcpClientAdapters } from '@/entities/mcpClient/adapters/mcpClientAdapters.entry'
import { mcpClients } from '@/entities/mcpClient/model/mcpClient.catalog'
import { validateClientCompatibility } from '@/entities/mcpClient/model/mcpClient.validation'
import { McpConfigError } from '@/entities/mcpConfig/model/McpConfigError'

export interface TargetConfigTranslation extends ConfigTranslation {
	targetId: McpClientId
}

export function translateConfig(
	raw: string,
	sourceId: McpClientId,
	targetId: McpClientId,
): ConfigTranslation {
	return translateConfigToMany(raw, sourceId, [targetId])[0]
}

export function translateConfigToMany(
	raw: string,
	sourceId: McpClientId,
	targetIds: McpClientId[],
): TargetConfigTranslation[] {
	if (!raw.trim()) {
		throw new McpConfigError('Paste a configuration or load an example first.')
	}

	const decoded = mcpClientAdapters[sourceId].decode(raw)
	return targetIds.map((targetId) => {
		validateClientCompatibility(decoded.config, targetId)
		return {
			targetId,
			output: mcpClientAdapters[targetId].encode(decoded.config),
			filename: mcpClients[targetId].filename,
			diagnostics: decoded.diagnostics,
			serverCount: decoded.config.servers.length,
		}
	})
}
