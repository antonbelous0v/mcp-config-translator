import { describe, expect, it } from 'vitest'
import { configExamples } from '@/features/translateConfig/model/examples'
import { detectMcpClient } from './detectMcpClient'

describe('detectMcpClient', () => {
	it.each([
		'claude-code',
		'codex',
		'cursor',
		'windsurf',
		'vscode',
		'gemini-cli',
		'cline',
		'roo-code',
		'zed',
		'opencode',
		'pi',
	] as const)('detects %s configuration', (client) => {
		expect(detectMcpClient(configExamples[client])).toBe(client)
	})

	it('waits for valid input', () => {
		expect(detectMcpClient('')).toBeNull()
		expect(detectMcpClient('{ "mcpServers":')).toBeNull()
	})
})
