import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppContainer } from '@/app/container/container'
import {
	SELECTED_TEMPLATE_ITEMS_REPOSITORY_TOKEN,
	TEMPLATE_ITEMS_REPOSITORY_TOKEN,
} from '../../../repository/types'
import { TemplateModuleService } from '../templateModule.service'

const templateItemsRepoMock = { getTemplateItems: vi.fn() }
const selectedItemsRepoMock = {
	getSelectedItemIds: vi.fn(),
	toggleSelected: vi.fn(),
	clearSelected: vi.fn(),
}

describe('templateModuleService.getTemplateItems', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns template items and applies selected state', async () => {
		const testContainer = createAppContainer().createChild()

		testContainer.bindAll(
			{
				provide: TEMPLATE_ITEMS_REPOSITORY_TOKEN,
				useValue: templateItemsRepoMock,
			},
			{
				provide: SELECTED_TEMPLATE_ITEMS_REPOSITORY_TOKEN,
				useValue: selectedItemsRepoMock,
			},
			{
				provide: TemplateModuleService,
				useClass: TemplateModuleService,
			},
		)

		templateItemsRepoMock.getTemplateItems.mockResolvedValue({
			items: [
				{
					id: 1,
					title: 'SSR-ready app shell',
					description: 'Framework-managed server render and hydration.',
					area: 'app',
					badge: 'SSR',
				},
				{
					id: 2,
					title: 'Feature-first example',
					description: 'A removable feature module.',
					area: 'features',
					badge: 'Feature',
				},
			],
		})

		selectedItemsRepoMock.getSelectedItemIds.mockResolvedValue([1])

		const service = testContainer.get(TemplateModuleService)
		const result = await service.getTemplateItems('ssr')

		expect(templateItemsRepoMock.getTemplateItems).toHaveBeenCalledWith('ssr')
		expect(selectedItemsRepoMock.getSelectedItemIds).toHaveBeenCalledOnce()
		expect(result).toHaveLength(2)
		expect(result[0].isSelected()).toBe(true)
		expect(result[1].isSelected()).toBe(false)
	})
})
