export type McpTransport = 'stdio' | 'http' | 'sse' | 'ws'
export type StringMap = Record<string, string>

export interface McpServer {
	name: string
	transport: McpTransport
	command?: string
	args?: string[]
	env?: StringMap
	url?: string
	headers?: StringMap
	cwd?: string
}

export interface McpConfig {
	servers: McpServer[]
}
