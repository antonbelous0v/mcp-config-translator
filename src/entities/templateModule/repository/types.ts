import type { TemplateItemsDTO } from '@/shared/dto/templateItemDto.types'
import { InjectionToken } from '@needle-di/core'

export interface TemplateItemsRepository {
	getTemplateItems: (query?: string) => Promise<TemplateItemsDTO>
}

export const TEMPLATE_ITEMS_REPOSITORY_TOKEN
	= new InjectionToken<TemplateItemsRepository>('TEMPLATE_ITEMS_REPOSITORY')

export interface SelectedTemplateItemsRepository {
	getSelectedItemIds: () => Promise<number[]>
	toggleSelected: (id: number) => Promise<void>
	clearSelected: () => Promise<void>
}

export const SELECTED_TEMPLATE_ITEMS_REPOSITORY_TOKEN
	= new InjectionToken<SelectedTemplateItemsRepository>(
		'SELECTED_TEMPLATE_ITEMS_REPOSITORY',
	)
