import type { DecodedMcpConfig } from '../model/mcpClient.types'
import type { McpConfig, McpServer } from '@/entities/mcpConfig/model/mcpConfig.types'
import { validateMcpServer } from '@/entities/mcpConfig/model/mcpConfig.validation'
import { McpConfigError } from '@/entities/mcpConfig/model/McpConfigError'
import { expectObject, inferTransport, optionalString, optionalStringArray, optionalStringMap } from '../lib/configValue'
import { appendIgnoredFields, appendRootFields, appendWhitespaceWarnings } from '../lib/diagnostics'
import { parseJsonObject } from './jsonMcp.codec'

const knownFields = new Set([
	'type',
	'command',
	'cwd',
	'environment',
	'url',
	'headers',
	'disabled',
	'codemode',
	'timeout',
	'protocol',
	'oauth',
])

export function decodeOpenCode(raw: string): DecodedMcpConfig {
	const root = parseJsonObject(raw)
	const mcp = expectObject(root.mcp, '"mcp"')
	const serverMap = expectObject(mcp.servers, '"mcp.servers"')
	const entries = Object.entries(serverMap)
	if (!entries.length) {
		throw new McpConfigError('"mcp.servers" must contain at least one server.')
	}

	const diagnostics: DecodedMcpConfig['diagnostics'] = []
	appendRootFields(diagnostics, root, 'mcp')
	appendRootFields(diagnostics, mcp, 'servers')
	const servers = entries.map(([name, value]) => decodeServer(name, value, diagnostics))
	return { config: { servers }, diagnostics }
}

export function encodeOpenCode(config: McpConfig) {
	const servers = Object.fromEntries(config.servers.map(server => [server.name, encodeServer(server)]))
	return `${JSON.stringify({
		$schema: 'https://opencode.ai/config.json',
		mcp: { servers },
	}, null, 2)}\n`
}

function decodeServer(name: string, value: unknown, diagnostics: DecodedMcpConfig['diagnostics']) {
	const source = expectObject(value, `Server "${name}"`)
	const commandParts = optionalStringArray(source.command, `Server "${name}" command`)
	const command = commandParts?.[0]
	const url = optionalString(source.url, `Server "${name}" URL`)
	const server: McpServer = {
		name,
		transport: inferTransport(source.type, command, url, name),
		command,
		args: commandParts?.slice(1),
		env: optionalStringMap(source.environment, `Server "${name}" environment`),
		url,
		headers: optionalStringMap(source.headers, `Server "${name}" headers`),
		cwd: optionalString(source.cwd, `Server "${name}" cwd`),
	}
	validateMcpServer(server)
	appendIgnoredFields(diagnostics, name, Object.keys(source).filter(key => !knownFields.has(key)))
	appendWhitespaceWarnings(diagnostics, server)
	return server
}

function encodeServer(server: McpServer) {
	if (server.transport === 'stdio') {
		return {
			type: 'local',
			command: [server.command, ...(server.args ?? [])],
			...(server.cwd ? { cwd: server.cwd } : {}),
			...(server.env ? { environment: server.env } : {}),
		}
	}
	return {
		type: 'remote',
		url: server.url,
		...(server.headers ? { headers: server.headers } : {}),
	}
}
