import type { TemplateItem } from '@/entities/templateModule/model/types'
import { Alert, Box, Loader, Stack, Text } from '@mantine/core'
import { CatalogInput } from './catalogInput.component'
import { CatalogList } from './catalogList.component'

interface Props {
	items: TemplateItem[]
	ready: boolean
	search: string
	onSearchChange: (value: string) => void
	onToggleSelected: (id: TemplateItem['id']) => Promise<void>
}

export function TemplateCatalogView({ items, ready, search, onSearchChange, onToggleSelected }: Props) {
	return (
		<Stack gap="md">
			<CatalogInput value={search} onChange={onSearchChange} />
			{!ready && (
				<Box ta="center" py="lg">
					<Loader />
				</Box>
			)}
			{items.length > 0 && ready && <CatalogList items={items} onToggleSelected={onToggleSelected} />}
			{items.length === 0 && ready && (
				<Alert color="gray" variant="light">
					<Text size="sm">No template blocks found. Try another search query.</Text>
				</Alert>
			)}
		</Stack>
	)
}
