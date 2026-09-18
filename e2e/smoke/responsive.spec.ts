import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

test('home page fits a small viewport without horizontal overflow', async ({ page }) => {
	await page.route('https://jsonplaceholder.typicode.com/posts?userId=1', route =>
		route.fulfill({ json: [] }))

	await page.goto('/')

	await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	await expect(page.getByRole('link', { name: 'Trace a real request' })).toBeVisible()

	const viewport = page.viewportSize()
	const main = await page.getByRole('main').boundingBox()

	expect(viewport).not.toBeNull()
	expect(main).not.toBeNull()
	expect((main?.x ?? 0) + (main?.width ?? 0)).toBeLessThanOrEqual(viewport?.width ?? 0)
})

test('hero keeps its actions visible on a wide, short viewport', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 760 })
	await page.route('https://jsonplaceholder.typicode.com/posts?userId=1', route =>
		route.fulfill({ json: [] }))

	await page.goto('/')

	const viewport = page.viewportSize()
	const primaryAction = await page.getByRole('link', { name: 'Trace a real request' }).boundingBox()
	const secondaryAction = await page.getByRole('link', { name: 'Test the state flow' }).boundingBox()

	expect(primaryAction).not.toBeNull()
	expect(secondaryAction).not.toBeNull()
	expect((primaryAction?.y ?? 0) + (primaryAction?.height ?? 0)).toBeLessThanOrEqual(viewport?.height ?? 0)
	expect((secondaryAction?.y ?? 0) + (secondaryAction?.height ?? 0)).toBeLessThanOrEqual(viewport?.height ?? 0)
})
