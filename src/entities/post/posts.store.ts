import type { Post } from './model/types'
import { inject } from '@needle-di/core'
import { action, computed, sleep, withAsync, withAsyncData, wrap } from '@reatom/core'
import { PostsService } from './services/posts.service'

export class PostsStore {
	constructor(private readonly postsService = inject(PostsService)) {}

	posts = computed(async () =>
		wrap(this.postsService.getFeaturedPosts()),
	).extend(withAsyncData({ initState: [] as Post[] }))

	refresh = action(async () => {
		await wrap(Promise.all([
			this.posts.retry(),
			sleep(600),
		]))
	}, 'posts.refresh').extend(withAsync())
}
