import type { Post } from './types'
import type { PostDTO } from '@/shared/dto/postDto.types'

export class PostsBuilder {
	private posts: Post[] = []

	fromDto(dto: PostDTO[]) {
		this.posts = dto.map(post => ({
			id: post.id,
			title: post.title,
			excerpt: post.body.replaceAll(/\s+/g, ' ').trim(),
			author: `User ${post.userId}`,
		}))

		return this
	}

	take(count: number) {
		this.posts = this.posts.slice(0, count)
		return this
	}

	build() {
		return this.posts
	}
}
