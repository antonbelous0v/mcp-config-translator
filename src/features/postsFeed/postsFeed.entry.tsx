import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { usePostsFeedService } from './postsFeed.injector'
import { PostsFeedView } from './ui/postsFeedView.component'

export const PostsFeedEntry = reatomComponent(() => {
	const { postsStore } = usePostsFeedService()
	const posts = postsStore.posts.data()
	const error = postsStore.posts.error()
	const ready = postsStore.posts.ready()
	const pending = postsStore.posts.pending() > 0
	const refreshing = postsStore.refresh.pending() > 0

	return (
		<PostsFeedView
			error={error}
			pending={pending}
			posts={posts}
			ready={ready}
			refreshing={refreshing}
			onRefresh={wrap(() => postsStore.refresh())}
		/>
	)
}, 'PostsFeedEntry')
