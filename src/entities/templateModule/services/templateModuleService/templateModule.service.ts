import type { TemplateItem } from '../../model/types'
import { inject } from '@needle-di/core'
import { wrap } from '@reatom/core'
import { TemplateItemsBuilder } from '../../model/templateItems.builder'
import { TemplateItemsModel } from '../../model/templateItems.model'
import {
	SELECTED_TEMPLATE_ITEMS_REPOSITORY_TOKEN,
	TEMPLATE_ITEMS_REPOSITORY_TOKEN,
} from '../../repository/types'

export class TemplateModuleService {
	constructor(
		private readonly templateItemsRepo = inject(TEMPLATE_ITEMS_REPOSITORY_TOKEN),
		private readonly selectedItemsRepo = inject(
			SELECTED_TEMPLATE_ITEMS_REPOSITORY_TOKEN,
		),
	) {}

	async getTemplateItems(query: string = '') {
		const [dto, selectedIds] = await Promise.all([
			this.templateItemsRepo.getTemplateItems(query),
			this.selectedItemsRepo.getSelectedItemIds(),
		])

		return new TemplateItemsBuilder()
			.fromDto(dto)
			.withSelectedIds(selectedIds)
			.build()
	}

	public getSelectedItems(items: TemplateItem[]) {
		return TemplateItemsModel.getSelectedItems(items)
	}

	public async toggleSelected(items: TemplateItem[], id: number) {
		await wrap(this.selectedItemsRepo.toggleSelected(id))

		TemplateItemsModel.toggleItemById(items, id)
	}

	public async clearSelected(items: TemplateItem[]) {
		await wrap(this.selectedItemsRepo.clearSelected())

		TemplateItemsModel.clearSelected(items)
	}
}
