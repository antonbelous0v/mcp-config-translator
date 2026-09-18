import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { useTemplateCatalogService } from './templateCatalog.injector'
import { TemplateCatalogView } from './ui/templateCatalogView.component'

export const TemplateCatalogEntry = reatomComponent(() => {
	const { templateModuleStore } = useTemplateCatalogService()
	const items = templateModuleStore.items

	return (
		<TemplateCatalogView
			items={items.data()}
			ready={items.ready()}
			search={templateModuleStore.search()}
			onSearchChange={wrap(value => templateModuleStore.search.set(value))}
			onToggleSelected={templateModuleStore.toggleSelected}
		/>
	)
}, 'TemplateCatalogEntry')
