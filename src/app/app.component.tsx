import type { Container } from '@needle-di/core'
import type { ReactNode } from 'react'
import { AppContainerProvider } from './container/container.provider'

export function AppProviders({ container, children }: { container: Container, children: ReactNode }) {
	return <AppContainerProvider container={container}>{children}</AppContainerProvider>
}
