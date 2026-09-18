import type { Atom } from '@reatom/core'

export interface TemplateItem {
	id: number
	title: string
	description: string
	area: string
	badge: string
	isSelected: Atom<boolean>
}
