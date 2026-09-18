import type { McpClientId } from '@/entities/mcpClient/model/mcpClient.types'
import type { McpConfig } from '@/entities/mcpConfig/model/mcpConfig.types'
import { mcpClientAdapters } from '@/entities/mcpClient/adapters/mcpClientAdapters.entry'
import { mcpClientIds } from '@/entities/mcpClient/model/mcpClient.catalog'

const exampleConfig: McpConfig = {
	servers: [
		{
			name: 'filesystem',
			transport: 'stdio',
			command: 'npx',
			args: ['-y', '@modelcontextprotocol/server-filesystem', './workspace'],
			env: { LOG_LEVEL: 'info' },
		},
		{
			name: 'project-api',
			transport: 'http',
			url: 'https://mcp.example.com/mcp',
			headers: { Authorization: `Bearer ${'$'}{API_TOKEN}` },
		},
	],
}

export const configExamples = Object.fromEntries(
	mcpClientIds.map(id => [id, mcpClientAdapters[id].encode(exampleConfig)]),
) as Record<McpClientId, string>
