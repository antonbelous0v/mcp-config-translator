import type { TemplateItem } from './model/types'
import { inject } from '@needle-di/core'
import { atom, computed, sleep, withAsyncData, wrap } from '@reatom/core'
import { TemplateModuleService } from './services/templateModuleService/templateModule.service'

export class TemplateModuleStore {
	constructor(
		private readonly templateModuleService = inject(TemplateModuleService),
	) {}

	search = atom('')

	items = computed(async () => {
		const query = this.search()

		if (query) {
			await wrap(sleep(150))
		}

		return wrap(this.templateModuleService.getTemplateItems(query))
	}).extend(withAsyncData({ initState: [] }))

	selectedItems = computed(() =>
		this.templateModuleService.getSelectedItems(this.items.data()),
	)

	clearSelected = async () => {
		await this.templateModuleService.clearSelected(this.items.data())
	}

	toggleSelected = async (id: TemplateItem['id']) => {
		await this.templateModuleService.toggleSelected(this.items.data(), id)
	}
}
