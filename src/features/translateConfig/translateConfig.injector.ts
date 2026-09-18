import type { TranslateConfigDeps } from './types'
import { createDi } from '@/shared/lib/react'

export const {
	Injector: TranslateConfigInjector,
	useDi: useTranslateConfigDeps,
} = createDi<TranslateConfigDeps>()
