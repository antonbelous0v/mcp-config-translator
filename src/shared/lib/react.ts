import type { Context } from 'react'
import { createContext, use } from 'react'

function useStrictContext<T>(context: Context<T | null>) {
	const value = use(context)
	if (value === null) {
		throw new Error('Empty context value')
	}
	return value
}

export function createDi<T>() {
	const DiContext = createContext<T | null>(null)
	return {
		Injector: DiContext.Provider,
		useDi: () => useStrictContext(DiContext),
	}
}
