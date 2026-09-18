import type { McpConfig, McpTransport } from '@/entities/mcpConfig/model/mcpConfig.types'

export type McpClientId
	= | 'claude-code'
		| 'claude-desktop'
		| 'codex'
		| 'cursor'
		| 'windsurf'
		| 'vscode'
		| 'gemini-cli'
		| 'cline'
		| 'roo-code'
		| 'zed'
		| 'opencode'
		| 'pi'

export interface McpClientDefinition {
	name: string
	format: 'JSON' | 'TOML'
	path: string
	filename: string
	supportedTransports: ReadonlySet<McpTransport>
	serverNamePattern?: RegExp
}

export interface TranslationDiagnostic {
	severity: 'warning' | 'info'
	message: string
	server?: string
}

export interface DecodedMcpConfig {
	config: McpConfig
	diagnostics: TranslationDiagnostic[]
}

export interface McpClientAdapter {
	decode: (raw: string) => DecodedMcpConfig
	encode: (config: McpConfig) => string
}

export interface ConfigTranslation {
	output: string
	filename: string
	diagnostics: TranslationDiagnostic[]
	serverCount: number
}
