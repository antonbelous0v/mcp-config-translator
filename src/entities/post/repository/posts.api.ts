import type { PostsRepository } from './types'
import type { ApiResponse, RequestConfig } from '@/shared/api/types'
import type { PostDTO } from '@/shared/dto/postDto.types'
import { HttpClient } from '@/shared/api/HttpClient'

const httpClient = new HttpClient('https://jsonplaceholder.typicode.com', {
	Accept: 'application/json',
})

export class PostsApi implements PostsRepository {
	getPosts(config?: RequestConfig): ApiResponse<PostDTO[]> {
		return httpClient.get<PostDTO[]>('posts', config?.options)
	}
}
