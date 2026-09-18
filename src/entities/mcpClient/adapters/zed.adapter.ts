import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeJsonMcp, encodeJsonMcp } from '../codecs/jsonMcp.codec'

const dialect = {
	rootKey: 'context_servers',
	remoteUrlField: 'url',
	emitTransport: 'never',
	acceptServerUrlAlias: false,
} as const

export const zedAdapter: McpClientAdapter = {
	decode: raw => decodeJsonMcp(raw, dialect),
	encode: config => encodeJsonMcp(config, dialect),
}
