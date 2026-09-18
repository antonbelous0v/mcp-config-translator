import type { McpClientId } from './mcpClient.types'
import type { McpConfig } from '@/entities/mcpConfig/model/mcpConfig.types'
import { McpConfigError } from '@/entities/mcpConfig/model/McpConfigError'
import { mcpClients } from './mcpClient.catalog'

export function validateClientCompatibility(config: McpConfig, targetId: McpClientId) {
	const target = mcpClients[targetId]

	for (const server of config.servers) {
		if (!target.supportedTransports.has(server.transport)) {
			throw new McpConfigError(
				`${target.name} does not support the ${server.transport} transport used by "${server.name}".`,
			)
		}
		if (target.serverNamePattern && !target.serverNamePattern.test(server.name)) {
			throw new McpConfigError(
				`${target.name} server names may contain only letters, numbers, hyphens, and underscores. Rename "${server.name}".`,
			)
		}
	}
}
