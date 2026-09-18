import type { ReactNode } from 'react'
import { SimpleGrid } from '@mantine/core'

export function TemplateItemList({
	children,
}: {
	children: ReactNode
}) {
	return (
		<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
			{children}
		</SimpleGrid>
	)
}
