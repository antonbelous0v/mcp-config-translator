import type { DecodedMcpConfig } from '../model/mcpClient.types'
import type { McpConfig, McpServer } from '@/entities/mcpConfig/model/mcpConfig.types'
import { parse, stringify } from 'smol-toml'
import { validateMcpServer } from '@/entities/mcpConfig/model/mcpConfig.validation'
import { McpConfigError } from '@/entities/mcpConfig/model/McpConfigError'
import { expectObject, inferTransport, optionalString, optionalStringArray, optionalStringMap } from '../lib/configValue'
import { appendIgnoredFields, appendRootFields, appendWhitespaceWarnings } from '../lib/diagnostics'

const knownFields = new Set(['command', 'args', 'env', 'cwd', 'url', 'http_headers'])

export function decodeCodexToml(raw: string): DecodedMcpConfig {
	const root = parseDocument(raw)
	const serverMap = expectObject(root.mcp_servers, '"mcp_servers"')
	const entries = Object.entries(serverMap)

	if (!entries.length) {
		throw new McpConfigError('"mcp_servers" must contain at least one server.')
	}

	const diagnostics: DecodedMcpConfig['diagnostics'] = []
	appendRootFields(diagnostics, root, 'mcp_servers')

	const servers = entries.map(([name, value]) => {
		const source = expectObject(value, `Server "${name}"`)
		const command = optionalString(source.command, `Server "${name}" command`)
		const url = optionalString(source.url, `Server "${name}" URL`)
		const server: McpServer = {
			name,
			transport: inferTransport(undefined, command, url, name),
			command,
			args: optionalStringArray(source.args, `Server "${name}" args`),
			env: optionalStringMap(source.env, `Server "${name}" env`),
			url,
			headers: optionalStringMap(source.http_headers, `Server "${name}" http_headers`),
			cwd: optionalString(source.cwd, `Server "${name}" cwd`),
		}

		validateMcpServer(server)
		appendIgnoredFields(diagnostics, name, Object.keys(source).filter(key => !knownFields.has(key)))
		appendWhitespaceWarnings(diagnostics, server)
		return server
	})

	return { config: { servers }, diagnostics }
}

export function encodeCodexToml(config: McpConfig) {
	const mcpServers = Object.fromEntries(config.servers.map(server => [
		server.name,
		encodeServer(server),
	]))

	return `${stringify({ mcp_servers: mcpServers }).trimEnd()}\n`
}

function parseDocument(raw: string) {
	try {
		return expectObject(parse(raw), 'The configuration root')
	}
	catch (error) {
		if (error instanceof McpConfigError) {
			throw error
		}
		const message = error instanceof Error ? error.message : String(error)
		throw new McpConfigError(`Invalid TOML: ${message}`)
	}
}

function encodeServer(server: McpServer) {
	const target: Record<string, unknown> = {}
	if (server.transport === 'stdio') {
		target.command = server.command
		if (server.args) {
			target.args = server.args
		}
		if (server.env) {
			target.env = server.env
		}
		if (server.cwd) {
			target.cwd = server.cwd
		}
	}
	else {
		target.url = server.url
		if (server.headers) {
			target.http_headers = server.headers
		}
	}
	return target
}
