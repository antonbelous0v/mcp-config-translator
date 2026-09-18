import type { TemplateItemsRepository } from './types'
import type { TemplateItemDTO } from '@/shared/dto/templateItemDto.types'

const TEMPLATE_ITEMS: TemplateItemDTO[] = [
	{
		id: 1,
		title: 'SSR before hydration',
		description:
			'React Router owns requests, status codes, server rendering, hydration, and route errors—without a custom server.',
		area: 'runtime',
		badge: 'SSR',
	},
	{
		id: 2,
		title: 'Boundaries enforced in CI',
		description:
			'ESLint rejects imports that cross the app, page, feature, entity, and shared layers in the wrong direction.',
		area: 'architecture',
		badge: 'Enforced',
	},
	{
		id: 3,
		title: 'Effects stay replaceable',
		description:
			'HTTP and storage sit behind narrow contracts and request-scoped DI instead of leaking into React components.',
		area: 'domain',
		badge: 'DI',
	},
	{
		id: 4,
		title: 'A demo designed to disappear',
		description:
			'The setup CLI removes the reference features while preserving the production baseline and its checks.',
		area: 'setup',
		badge: 'Reset',
	},
]

export class TemplateItemsMemoryRepository implements TemplateItemsRepository {
	async getTemplateItems(query: string = '') {
		const normalizedQuery = query.trim().toLowerCase()

		if (!normalizedQuery) {
			return { items: TEMPLATE_ITEMS }
		}

		return {
			items: TEMPLATE_ITEMS.filter(item =>
				[
					item.title,
					item.description,
					item.area,
					item.badge,
				].some(value => value.toLowerCase().includes(normalizedQuery)),
			),
		}
	}
}
