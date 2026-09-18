import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeJsonMcp, encodeJsonMcp } from '../codecs/jsonMcp.codec'

const dialect = {
	remoteUrlField: 'url',
	emitTransport: 'always',
	acceptServerUrlAlias: false,
} as const

export const claudeCodeAdapter: McpClientAdapter = {
	decode: raw => decodeJsonMcp(raw, dialect),
	encode: config => encodeJsonMcp(config, dialect),
}
