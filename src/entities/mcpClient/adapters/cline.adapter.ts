import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeJsonMcp, encodeJsonMcp } from '../codecs/jsonMcp.codec'

const dialect = {
	remoteUrlField: 'url',
	emitTransport: 'always',
	acceptServerUrlAlias: false,
	transportNames: { http: 'streamableHttp' },
	additionalFields: ['disabled', 'autoApprove', 'timeout', 'oauth'],
	defaults: { disabled: false, autoApprove: [] },
} as const

export const clineAdapter: McpClientAdapter = {
	decode: raw => decodeJsonMcp(raw, dialect),
	encode: config => encodeJsonMcp(config, dialect),
}
