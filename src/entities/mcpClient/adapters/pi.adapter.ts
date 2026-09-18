import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeJsonMcp, encodeJsonMcp } from '../codecs/jsonMcp.codec'

const dialect = {
	remoteUrlField: 'url',
	emitTransport: 'remote-only',
	transportField: 'transport',
	acceptServerUrlAlias: false,
	transportNames: { http: 'streamable-http' },
	additionalFields: ['auth', 'directTools', 'lifecycle', 'idleTimeout', 'enabled', 'disabled'],
} as const

export const piAdapter: McpClientAdapter = {
	decode: raw => decodeJsonMcp(raw, dialect),
	encode: config => encodeJsonMcp(config, dialect),
}
