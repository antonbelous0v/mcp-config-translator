import type { TemplateItemCardProps } from './types'
import { Button, Card, Group, Text, Title } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import styles from './templateItemCard.component.module.css'

export const TemplateItemCard = reatomComponent(
	({ item, onToggleSelected }: TemplateItemCardProps) => {
		const isSelected = item.isSelected()

		return (
			<Card className={styles.card} radius={0} padding="lg" h="100%">
				<Group justify="space-between" align="flex-start" mb="md">
					<Text className={styles.area} size="xs" tt="uppercase" fw={700}>
						{String(item.id).padStart(2, '0')}
						{' '}
						/
						{item.area}
					</Text>
					<Text className={styles.badge} size="xs">
						[
						{item.badge}
						]
					</Text>
				</Group>

				<Title order={3} className={styles.title} mb="xs">
					{item.title}
				</Title>

				<Text className={styles.description} size="sm" mb="xl">
					{item.description}
				</Text>

				<Button
					mt="auto"
					size="compact-sm"
					variant={isSelected ? 'filled' : 'subtle'}
					onClick={wrap(() => onToggleSelected(item.id))}
				>
					{isSelected ? 'Selected' : 'Select block'}
				</Button>
			</Card>
		)
	},
)
