import type { McpTransport, StringMap } from '@/entities/mcpConfig/model/mcpConfig.types'
import { McpConfigError } from '@/entities/mcpConfig/model/McpConfigError'

export function expectObject(value: unknown, label: string): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new McpConfigError(`${label} must be an object.`)
	}
	return value as Record<string, unknown>
}

export function optionalString(value: unknown, label: string) {
	if (value === undefined) {
		return undefined
	}
	if (typeof value !== 'string' || value.length === 0) {
		throw new McpConfigError(`${label} must be a non-empty string.`)
	}
	return value
}

export function optionalStringArray(value: unknown, label: string) {
	if (value === undefined) {
		return undefined
	}
	if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
		throw new McpConfigError(`${label} must be an array of strings.`)
	}
	return value as string[]
}

export function optionalStringMap(value: unknown, label: string) {
	if (value === undefined) {
		return undefined
	}
	const object = expectObject(value, label)
	if (Object.values(object).some(item => typeof item !== 'string')) {
		throw new McpConfigError(`${label} must contain string values only.`)
	}
	return object as StringMap
}

export function inferTransport(
	rawTransport: unknown,
	command: string | undefined,
	url: string | undefined,
	serverName: string,
): McpTransport {
	if (rawTransport !== undefined && typeof rawTransport !== 'string') {
		throw new McpConfigError(`Server "${serverName}" transport must be a string.`)
	}

	const normalized = rawTransport?.toLowerCase()
	if (normalized === 'local') {
		return 'stdio'
	}
	if (normalized === 'streamable-http' || normalized === 'streamablehttp' || normalized === 'remote') {
		return 'http'
	}
	if (normalized === 'stdio' || normalized === 'http' || normalized === 'sse' || normalized === 'ws') {
		return normalized
	}
	if (normalized) {
		throw new McpConfigError(`Server "${serverName}" has unsupported transport "${rawTransport}".`)
	}
	if (command) {
		return 'stdio'
	}
	if (url) {
		return 'http'
	}
	throw new McpConfigError(`Server "${serverName}" needs either a command or URL.`)
}
