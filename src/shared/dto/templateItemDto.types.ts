export interface TemplateItemDTO {
	id: number
	title: string
	description: string
	area: string
	badge: string
}

export interface TemplateItemsDTO {
	items: TemplateItemDTO[]
}
