import type { Container } from '@needle-di/core'

export interface ProviderModule {
	provider: (container: Container) => void
}
