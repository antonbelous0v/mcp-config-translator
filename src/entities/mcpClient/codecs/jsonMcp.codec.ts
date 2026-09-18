import type { ParseError } from 'jsonc-parser'
import type { DecodedMcpConfig } from '../model/mcpClient.types'
import type { McpConfig, McpServer } from '@/entities/mcpConfig/model/mcpConfig.types'
import { parse, printParseErrorCode } from 'jsonc-parser'
import { validateMcpServer } from '@/entities/mcpConfig/model/mcpConfig.validation'
import { McpConfigError } from '@/entities/mcpConfig/model/McpConfigError'
import { expectObject, inferTransport, optionalString, optionalStringArray, optionalStringMap } from '../lib/configValue'
import { appendIgnoredFields, appendRootFields, appendWhitespaceWarnings } from '../lib/diagnostics'

const knownFields = new Set([
	'type',
	'transport',
	'command',
	'args',
	'env',
	'url',
	'serverUrl',
	'httpUrl',
	'headers',
	'cwd',
	'environment',
])

export interface JsonMcpDialect {
	rootKey?: 'mcpServers' | 'servers' | 'context_servers'
	remoteUrlField: 'url' | 'serverUrl' | 'httpUrl'
	httpUrlField?: 'url' | 'httpUrl'
	envField?: 'env' | 'environment'
	emitTransport: 'always' | 'remote-only' | 'sse-only' | 'never'
	transportField?: 'type' | 'transport'
	acceptServerUrlAlias: boolean
	transportNames?: Partial<Record<McpServer['transport'], string>>
	additionalFields?: readonly string[]
	defaults?: Readonly<Record<string, unknown>>
}

export function decodeJsonMcp(raw: string, dialect: JsonMcpDialect): DecodedMcpConfig {
	const root = parseJsonObject(raw)
	const rootKey = dialect.rootKey ?? 'mcpServers'
	const serverMap = expectObject(root[rootKey], `"${rootKey}"`)
	const entries = Object.entries(serverMap)

	if (!entries.length) {
		throw new McpConfigError(`"${rootKey}" must contain at least one server.`)
	}

	const diagnostics: DecodedMcpConfig['diagnostics'] = []
	appendRootFields(diagnostics, root, rootKey)
	const acceptedFields = new Set([...knownFields, ...(dialect.additionalFields ?? [])])

	const servers = entries.map(([name, value]) => {
		const source = expectObject(value, `Server "${name}"`)
		const ignored = Object.keys(source).filter(key => !acceptedFields.has(key))
		if (!dialect.acceptServerUrlAlias && source.serverUrl !== undefined) {
			ignored.push('serverUrl alias')
		}

		const command = optionalString(source.command, `Server "${name}" command`)
		const url = optionalString(source.serverUrl ?? source.httpUrl ?? source.url, `Server "${name}" URL`)
		const server: McpServer = {
			name,
			transport: inferTransport(source.type ?? source.transport, command, url, name),
			command,
			args: optionalStringArray(source.args, `Server "${name}" args`),
			env: optionalStringMap(source[dialect.envField ?? 'env'], `Server "${name}" environment`),
			url,
			headers: optionalStringMap(source.headers, `Server "${name}" headers`),
			cwd: optionalString(source.cwd, `Server "${name}" cwd`),
		}

		validateMcpServer(server)
		appendIgnoredFields(diagnostics, name, ignored)
		appendWhitespaceWarnings(diagnostics, server)
		return server
	})

	return { config: { servers }, diagnostics }
}

export function encodeJsonMcp(config: McpConfig, dialect: JsonMcpDialect) {
	const rootKey = dialect.rootKey ?? 'mcpServers'
	const servers = Object.fromEntries(config.servers.map(server => [
		server.name,
		encodeServer(server, dialect),
	]))

	return `${JSON.stringify({ [rootKey]: servers }, null, 2)}\n`
}

export function parseJsonObject(raw: string) {
	const errors: ParseError[] = []
	const value: unknown = parse(raw, errors, { allowTrailingComma: true })
	const error = errors[0]
	if (error) {
		const beforeError = raw.slice(0, error.offset)
		const line = beforeError.split('\n').length
		const column = error.offset - beforeError.lastIndexOf('\n')
		throw new McpConfigError(
			`Invalid JSON at line ${line}, column ${column}: ${printParseErrorCode(error.error)}.`,
		)
	}
	return expectObject(value, 'The configuration root')
}

function encodeServer(server: McpServer, dialect: JsonMcpDialect) {
	const target: Record<string, unknown> = { ...dialect.defaults }
	if (dialect.emitTransport === 'always'
		|| (dialect.emitTransport === 'remote-only' && server.transport !== 'stdio')
		|| (dialect.emitTransport === 'sse-only' && server.transport === 'sse')) {
		target[dialect.transportField ?? 'type'] = dialect.transportNames?.[server.transport] ?? server.transport
	}

	if (server.transport === 'stdio') {
		target.command = server.command
		if (server.args) {
			target.args = server.args
		}
		if (server.env) {
			target[dialect.envField ?? 'env'] = server.env
		}
		if (server.cwd) {
			target.cwd = server.cwd
		}
	}
	else {
		const urlField = server.transport === 'http' && dialect.httpUrlField
			? dialect.httpUrlField
			: dialect.remoteUrlField
		target[urlField] = server.url
		if (server.headers) {
			target.headers = server.headers
		}
	}

	return target
}
