import type { Container } from '@needle-di/core'
import { SelectedTemplateItemsStorage } from './repository/selectedTemplateItems.storage'
import { TemplateItemsMemoryRepository } from './repository/templateItems.memory'
import {
	SELECTED_TEMPLATE_ITEMS_REPOSITORY_TOKEN,
	TEMPLATE_ITEMS_REPOSITORY_TOKEN,
} from './repository/types'
import { TemplateModuleService } from './services/templateModuleService/templateModule.service'
import { TemplateModuleStore } from './templateModule.store'

export function provider(container: Container) {
	container.bindAll(
		{
			provide: TEMPLATE_ITEMS_REPOSITORY_TOKEN,
			useClass: TemplateItemsMemoryRepository,
		},
		{
			provide: SELECTED_TEMPLATE_ITEMS_REPOSITORY_TOKEN,
			useClass: SelectedTemplateItemsStorage,
		},
		{
			provide: TemplateModuleService,
			useClass: TemplateModuleService,
		},
		{
			provide: TemplateModuleStore,
			useClass: TemplateModuleStore,
		},
	)
}
