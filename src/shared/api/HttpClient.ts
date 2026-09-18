import type { ApiResponse, RequestOptions, SearchParams } from './types'

export class HttpClient {
	constructor(
		private readonly baseUrl: string,
		private readonly defaultHeaders: HeadersInit = {},
	) {}

	get<T>(endpoint: string, options: RequestOptions = {}): ApiResponse<T> {
		return this.request<T>(endpoint, 'GET', options)
	}

	private async request<T>(
		endpoint: string,
		method: RequestInit['method'],
		options: RequestOptions,
	): ApiResponse<T> {
		const { params, ...init } = options
		const response = await fetch(this.createUrl(endpoint, params), {
			...init,
			method,
			headers: this.createHeaders(init.headers),
		})

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}.`)
		}

		return {
			data: response.status === 204 ? undefined as T : await response.json() as T,
			status: response.status,
			headers: response.headers,
		}
	}

	private createHeaders(requestHeaders?: HeadersInit) {
		const headers = new Headers(this.defaultHeaders)
		new Headers(requestHeaders).forEach((value, key) => headers.set(key, value))
		return headers
	}

	private createUrl(endpoint: string, params?: SearchParams) {
		const url = new URL(endpoint, `${this.baseUrl.replace(/\/$/, '')}/`)

		for (const [key, rawValue] of Object.entries(params ?? {})) {
			const values = Array.isArray(rawValue) ? rawValue : [rawValue]

			for (const value of values) {
				if (value !== null && value !== undefined) {
					url.searchParams.append(key, String(value))
				}
			}
		}

		return url
	}
}
