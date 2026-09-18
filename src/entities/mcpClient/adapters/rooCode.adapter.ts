import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeJsonMcp, encodeJsonMcp } from '../codecs/jsonMcp.codec'

const dialect = {
	remoteUrlField: 'url',
	emitTransport: 'always',
	acceptServerUrlAlias: false,
	transportNames: { http: 'streamable-http' },
	additionalFields: ['disabled', 'alwaysAllow', 'disabledTools', 'timeout', 'watchPaths'],
	defaults: { disabled: false, alwaysAllow: [] },
} as const

export const rooCodeAdapter: McpClientAdapter = {
	decode: raw => decodeJsonMcp(raw, dialect),
	encode: config => encodeJsonMcp(config, dialect),
}
