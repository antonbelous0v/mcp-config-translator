import type { McpServer, McpTransport } from './mcpConfig.types'
import { McpConfigError } from './McpConfigError'

export function validateMcpServer(server: McpServer) {
	if (!server.name.trim()) {
		throw new McpConfigError('Server names cannot be empty.')
	}

	if (server.transport === 'stdio') {
		if (!server.command) {
			throw new McpConfigError(`Server "${server.name}" uses stdio but has no command.`)
		}
		if (server.url) {
			throw ambiguousTransportError(server.name)
		}
		return
	}

	if (!server.url) {
		throw new McpConfigError(`Server "${server.name}" uses ${server.transport} but has no URL.`)
	}
	if (server.command) {
		throw ambiguousTransportError(server.name)
	}
	validateRemoteUrl(server.name, server.transport, server.url)
}

function validateRemoteUrl(name: string, transport: McpTransport, url: string) {
	if (url.includes('${')) {
		return
	}

	const pattern = transport === 'ws' ? /^wss?:\/\//i : /^https?:\/\//i
	if (!pattern.test(url)) {
		const expected = transport === 'ws' ? 'ws:// or wss://' : 'http:// or https://'
		throw new McpConfigError(`Server "${name}" URL must start with ${expected}.`)
	}
}

function ambiguousTransportError(name: string) {
	return new McpConfigError(`Server "${name}" has both command and URL. Keep only one transport.`)
}
