import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppContainer } from '@/app/container/container'
import { POSTS_REPOSITORY_TOKEN } from '../../repository/types'
import { PostsService } from '../posts.service'

const postsRepositoryMock = { getPosts: vi.fn() }

describe('postsService.getFeaturedPosts', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps transport DTOs into a limited domain model', async () => {
		const testContainer = createAppContainer().createChild()

		testContainer.bindAll(
			{
				provide: POSTS_REPOSITORY_TOKEN,
				useValue: postsRepositoryMock,
			},
			{
				provide: PostsService,
				useClass: PostsService,
			},
		)

		postsRepositoryMock.getPosts.mockResolvedValue({
			data: Array.from({ length: 4 }, (_, index) => ({
				userId: 1,
				id: index + 1,
				title: `Post ${index + 1}`,
				body: 'A transport\n value.',
			})),
			status: 200,
			headers: new Headers(),
		})

		const service = testContainer.get(PostsService)
		const result = await service.getFeaturedPosts()

		expect(postsRepositoryMock.getPosts).toHaveBeenCalledWith({
			options: { params: { userId: 1 } },
		})
		expect(result).toHaveLength(3)
		expect(result[0]).toEqual({
			id: 1,
			title: 'Post 1',
			excerpt: 'A transport value.',
			author: 'User 1',
		})
	})
})
