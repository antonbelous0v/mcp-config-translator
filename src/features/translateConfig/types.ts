import type { TargetConfigTranslation } from './model/translateConfig'
import type { TranslateConfigStore } from './model/translateConfig.store'
import type { McpClientId } from '@/entities/mcpClient/model/mcpClient.types'

export interface TranslateConfigDeps {
	store: TranslateConfigStore
}

export interface McpClientOption {
	id: McpClientId
	name: string
	path: string
	format: string
}

export interface TranslateConfigViewModel {
	clients: McpClientOption[]
	source: McpClientId
	target: McpClientId
	targets: McpClientId[]
	input: string
	result: TargetConfigTranslation | null
	message: string
	sourceHint: string
	copyLabel: string
	hasError: boolean
	conversionVersion: number
	canConvert: boolean
	changeSource: (client: McpClientId) => void
	changeTarget: (client: McpClientId) => void
	changeTargets: (clients: McpClientId[]) => void
	changeInput: (input: string) => void
	swap: () => void
	loadExample: () => void
	clear: () => void
	run: () => void
	copy: () => void
	download: () => void
}
