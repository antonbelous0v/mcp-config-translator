import type { McpClientAdapter, McpClientId } from '../model/mcpClient.types'
import { claudeCodeAdapter } from './claudeCode.adapter'
import { claudeDesktopAdapter } from './claudeDesktop.adapter'
import { clineAdapter } from './cline.adapter'
import { codexAdapter } from './codex.adapter'
import { cursorAdapter } from './cursor.adapter'
import { geminiCliAdapter } from './geminiCli.adapter'
import { openCodeAdapter } from './openCode.adapter'
import { piAdapter } from './pi.adapter'
import { rooCodeAdapter } from './rooCode.adapter'
import { vscodeAdapter } from './vscode.adapter'
import { windsurfAdapter } from './windsurf.adapter'
import { zedAdapter } from './zed.adapter'

export const mcpClientAdapters: Record<McpClientId, McpClientAdapter> = {
	'claude-code': claudeCodeAdapter,
	'claude-desktop': claudeDesktopAdapter,
	'codex': codexAdapter,
	'cursor': cursorAdapter,
	'windsurf': windsurfAdapter,
	'vscode': vscodeAdapter,
	'gemini-cli': geminiCliAdapter,
	'cline': clineAdapter,
	'roo-code': rooCodeAdapter,
	'zed': zedAdapter,
	'opencode': openCodeAdapter,
	'pi': piAdapter,
}
