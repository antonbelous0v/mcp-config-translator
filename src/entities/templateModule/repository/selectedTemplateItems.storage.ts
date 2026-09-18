import type { TemplateItem } from '../model/types'
import type { SelectedTemplateItemsRepository } from './types'
import type { KeyValueStorage } from '@/shared/storages/types'
import { inject } from '@needle-di/core'
import { KEY_VALUE_STORAGE_TOKEN } from '@/shared/storages/types'

const SELECTED_ITEMS_KEY = 'selected-template-items'

export class SelectedTemplateItemsStorage
implements SelectedTemplateItemsRepository {
	selectedIds: TemplateItem['id'][] = []

	constructor(
		private readonly storage: KeyValueStorage = inject(KEY_VALUE_STORAGE_TOKEN),
	) {}

	async getSelectedItemIds() {
		const result
			= (await this.storage.get<TemplateItem['id'][]>(SELECTED_ITEMS_KEY)) ?? []

		this.selectedIds = result
		return result
	}

	async toggleSelected(id: number) {
		const selectedIds = this.selectedIds

		if (this.isSelected(id)) {
			await this.save(selectedIds.filter(element => element !== id))
		}
		else {
			await this.save([...selectedIds, id])
		}
	}

	async clearSelected() {
		this.selectedIds = []
		await this.storage.delete(SELECTED_ITEMS_KEY)
	}

	private async save(value: TemplateItem['id'][]) {
		this.selectedIds = value
		await this.storage.set(SELECTED_ITEMS_KEY, value)
	}

	private isSelected(id: TemplateItem['id']) {
		return this.selectedIds.includes(id)
	}
}
