import type { Container } from '@needle-di/core'
import { PostsStore } from './posts.store'
import { PostsApi } from './repository/posts.api'
import { POSTS_REPOSITORY_TOKEN } from './repository/types'
import { PostsService } from './services/posts.service'

export function provider(container: Container) {
	container.bindAll(
		{
			provide: POSTS_REPOSITORY_TOKEN,
			useClass: PostsApi,
		},
		{
			provide: PostsService,
			useClass: PostsService,
		},
		{
			provide: PostsStore,
			useClass: PostsStore,
		},
	)
}
