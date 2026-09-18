import type { TemplateCatalogDeps } from './types'
import { createDi } from '@/shared/lib/react'

export const {
	Injector: TemplateCatalogInjector,
	useDi: useTemplateCatalogService,
} = createDi<TemplateCatalogDeps>()
