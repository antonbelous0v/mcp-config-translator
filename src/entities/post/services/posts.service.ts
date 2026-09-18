import { inject } from '@needle-di/core'
import { PostsBuilder } from '../model/posts.builder'
import { POSTS_REPOSITORY_TOKEN } from '../repository/types'

export class PostsService {
	constructor(
		private readonly postsRepository = inject(POSTS_REPOSITORY_TOKEN),
	) {}

	async getFeaturedPosts() {
		const { data } = await this.postsRepository.getPosts({
			options: { params: { userId: 1 } },
		})

		return new PostsBuilder().fromDto(data).take(3).build()
	}
}
