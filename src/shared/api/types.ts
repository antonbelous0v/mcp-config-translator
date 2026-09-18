type SearchParam = string | number | boolean | null | undefined
export type SearchParams = Record<string, SearchParam | readonly SearchParam[]>

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
	params?: SearchParams
}

export interface RequestConfig {
	options?: RequestOptions
}

interface ApiResult<T> {
	data: T
	status: number
	headers: Headers
}

export type ApiResponse<T> = Promise<ApiResult<T>>
