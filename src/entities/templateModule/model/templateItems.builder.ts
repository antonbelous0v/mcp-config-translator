import type { TemplateItem } from './types'
import type { TemplateItemsDTO } from '@/shared/dto/templateItemDto.types'
import { atom } from '@reatom/core'

export class TemplateItemsBuilder {
	private items: TemplateItem[] = []

	fromDto(dto: TemplateItemsDTO): TemplateItemsBuilder {
		this.items = dto.items.map(item => ({
			id: item.id,
			title: item.title,
			description: item.description,
			area: item.area,
			badge: item.badge,
			isSelected: atom(false),
		}))

		return this
	}

	withSelectedIds(selectedIds: number[]) {
		this.items = this.items.map(item => ({
			...item,
			isSelected: atom(selectedIds.includes(item.id)),
		}))

		return this
	}

	build(): TemplateItem[] {
		return this.items
	}
}
