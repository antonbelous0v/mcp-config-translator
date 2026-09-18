import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeJsonMcp, encodeJsonMcp } from '../codecs/jsonMcp.codec'

const dialect = {
	remoteUrlField: 'serverUrl',
	emitTransport: 'never',
	acceptServerUrlAlias: true,
} as const

export const windsurfAdapter: McpClientAdapter = {
	decode: raw => decodeJsonMcp(raw, dialect),
	encode: config => encodeJsonMcp(config, dialect),
}
