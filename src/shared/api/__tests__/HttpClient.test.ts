import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpClient } from '../HttpClient'

describe('httpClient', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('builds query parameters and merges request headers', async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		)
		vi.stubGlobal('fetch', fetchMock)
		const client = new HttpClient('https://api.example.test/v1', { Accept: 'application/json' })

		const result = await client.get<{ ok: boolean }>('items', {
			params: { active: false, page: 0, tag: ['one', 'two'] },
			headers: { 'X-Request-ID': 'test' },
		})

		const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit]
		expect(url.toString()).toBe('https://api.example.test/v1/items?active=false&page=0&tag=one&tag=two')
		expect(new Headers(init.headers).get('Accept')).toBe('application/json')
		expect(new Headers(init.headers).get('X-Request-ID')).toBe('test')
		expect(result.data).toEqual({ ok: true })
	})

	it('rejects unsuccessful HTTP responses', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))
		const client = new HttpClient('https://api.example.test')

		await expect(client.get('items')).rejects.toThrow('Request failed with status 503.')
	})
})
