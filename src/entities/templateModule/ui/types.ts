import type { TemplateItem } from '../model/types'

export interface TemplateItemCardProps {
	item: TemplateItem
	onToggleSelected: (id: TemplateItem['id']) => void
}
