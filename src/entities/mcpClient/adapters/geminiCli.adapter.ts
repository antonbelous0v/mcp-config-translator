import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeJsonMcp, encodeJsonMcp } from '../codecs/jsonMcp.codec'

const dialect = {
	remoteUrlField: 'url',
	httpUrlField: 'httpUrl',
	emitTransport: 'never',
	acceptServerUrlAlias: false,
	additionalFields: ['timeout', 'trust', 'includeTools', 'excludeTools', 'oauth'],
} as const

export const geminiCliAdapter: McpClientAdapter = {
	decode: raw => decodeJsonMcp(raw, dialect),
	encode: config => encodeJsonMcp(config, dialect),
}
