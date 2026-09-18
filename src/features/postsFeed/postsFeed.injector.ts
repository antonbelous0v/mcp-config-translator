import type { PostsFeedDeps } from './types'
import { createDi } from '@/shared/lib/react'

export const {
	Injector: PostsFeedInjector,
	useDi: usePostsFeedService,
} = createDi<PostsFeedDeps>()
