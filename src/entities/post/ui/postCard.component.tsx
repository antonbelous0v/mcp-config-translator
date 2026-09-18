import type { Post } from '../model/types'
import { Card, Text, Title } from '@mantine/core'
import styles from './postCard.component.module.css'

export function PostCard({ post, index }: { post: Post, index: number }) {
	return (
		<Card component="article" className={styles.card} padding="lg" radius={0}>
			<Text className={styles.index} ff="monospace">{String(index + 1).padStart(2, '0')}</Text>
			<div>
				<Title order={3} className={styles.title}>{post.title}</Title>
				<Text className={styles.excerpt} size="sm">{post.excerpt}</Text>
			</div>
			<Text className={styles.author} size="xs">{post.author}</Text>
		</Card>
	)
}
