import type { McpClientId } from '@/entities/mcpClient/model/mcpClient.types'
import { translateConfig, translateConfigToMany } from '../model/translateConfig'

export class TranslationService {
	translate(raw: string, source: McpClientId, targets: McpClientId[]) {
		return translateConfigToMany(raw, source, targets)
	}

	translateOne(raw: string, source: McpClientId, target: McpClientId) {
		return translateConfig(raw, source, target)
	}
}
