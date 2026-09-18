import { expect, test } from '@playwright/test'

const viewports = [
	{ width: 320, height: 568 },
	{ width: 375, height: 812 },
	{ width: 768, height: 1024 },
	{ width: 1440, height: 760 },
]

for (const viewport of viewports) {
	test(`converter fits inside ${viewport.width}x${viewport.height}`, async ({ page }) => {
		await page.setViewportSize(viewport)
		await page.goto('/')

		const translator = page.locator('#translator')
		const main = page.getByRole('main')
		const box = await translator.boundingBox()
		const mainBox = await main.boundingBox()

		await expect(page.getByRole('textbox', { name: 'Source config' })).toBeVisible()
		await expect(page.getByRole('textbox', { name: 'Converted config' })).toBeVisible()
		await expect(page.getByRole('button', { name: 'Convert config' })).toBeVisible()
		expect(box).not.toBeNull()
		expect(mainBox).not.toBeNull()
		expect(box?.y).toBeGreaterThanOrEqual(0)
		expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(viewport.height + 1)
		expect((mainBox?.x ?? 0) + (mainBox?.width ?? 0)).toBeLessThanOrEqual(viewport.width)

		for (const control of await translator.locator('button, select, textarea').all()) {
			const controlBox = await control.boundingBox()
			expect(controlBox).not.toBeNull()
			expect(controlBox?.x).toBeGreaterThanOrEqual(0)
			expect((controlBox?.x ?? 0) + (controlBox?.width ?? 0)).toBeLessThanOrEqual(viewport.width)
		}
	})
}
