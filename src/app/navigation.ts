import type { NavigationItem } from '@/shared/navigation.types'

interface NavigationModule {
	default: NavigationItem
}

const modules = import.meta.glob<NavigationModule>('../pages/**/navigation.ts', { eager: true })

export const navigationItems = Object.values(modules)
	.map(module => module.default)
	.sort((left, right) => left.order - right.order)
