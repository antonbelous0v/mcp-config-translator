import type { Container, Token } from '@needle-di/core'
import { createContext, use } from 'react'

export const AppContainerContext = createContext<Container | null>(null)

export function useService<T>(token: Token<T>) {
	const container = use(AppContainerContext)
	if (!container) {
		throw new Error('AppContainerProvider is missing in the React tree.')
	}
	return container.get(token)
}
