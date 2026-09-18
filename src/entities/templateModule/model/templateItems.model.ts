import type { TemplateItem } from './types'

export class TemplateItemsModel {
	private constructor() {}

	static clearSelected(items: TemplateItem[]) {
		for (const item of items) {
			item.isSelected.set(false)
		}
	}

	static getSelectedItems(items: TemplateItem[]) {
		return items.filter(item => item.isSelected())
	}

	static toggleItemById(items: TemplateItem[], id: number) {
		const target = items.find(item => item.id === id)

		if (!target) {
			return
		}

		target.isSelected.set(!target.isSelected())
	}
}
