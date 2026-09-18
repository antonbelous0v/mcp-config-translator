import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeJsonMcp, encodeJsonMcp } from '../codecs/jsonMcp.codec'

const dialect = {
	rootKey: 'servers',
	remoteUrlField: 'url',
	emitTransport: 'always',
	acceptServerUrlAlias: false,
	additionalFields: ['sandboxEnabled'],
} as const

export const vscodeAdapter: McpClientAdapter = {
	decode: raw => decodeJsonMcp(raw, dialect),
	encode: config => encodeJsonMcp(config, dialect),
}
