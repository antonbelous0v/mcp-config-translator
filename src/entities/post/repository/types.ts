import type { ApiResponse, RequestConfig } from '@/shared/api/types'
import type { PostDTO } from '@/shared/dto/postDto.types'
import { InjectionToken } from '@needle-di/core'

export interface PostsRepository {
	getPosts: (config?: RequestConfig) => ApiResponse<PostDTO[]>
}

export const POSTS_REPOSITORY_TOKEN
	= new InjectionToken<PostsRepository>('POSTS_REPOSITORY')
