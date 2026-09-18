import type { McpClientAdapter } from '../model/mcpClient.types'
import { decodeCodexToml, encodeCodexToml } from '../codecs/codexToml.codec'

export const codexAdapter: McpClientAdapter = {
	decode: decodeCodexToml,
	encode: encodeCodexToml,
}
