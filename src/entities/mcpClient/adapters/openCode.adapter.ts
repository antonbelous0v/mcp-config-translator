import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeOpenCode, encodeOpenCode } from '../codecs/openCode.codec'

export const openCodeAdapter: McpClientAdapter = {
	decode: decodeOpenCode,
	encode: encodeOpenCode,
}
