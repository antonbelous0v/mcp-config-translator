export class McpConfigError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'McpConfigError'
	}
}
