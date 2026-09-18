import type { TemplateItem } from '@/entities/templateModule/model/types'
import { TemplateItemList } from '@/entities/templateModule/ui/templateItemList.component'
import { CatalogCard } from './catalogCard.component'

export function CatalogList({ items, onToggleSelected }: {
	items: TemplateItem[]
	onToggleSelected: (id: TemplateItem['id']) => Promise<void>
}) {
	return (
		<TemplateItemList>
			{items.map(item => (
				<CatalogCard key={item.id} item={item} onToggleSelected={onToggleSelected} />
			))}
		</TemplateItemList>
	)
}
