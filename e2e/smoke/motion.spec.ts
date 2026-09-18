import { expect, test } from '@playwright/test'

test('reveals below-fold sections as they enter the viewport', async ({ page }) => {
	await page.route('https://jsonplaceholder.typicode.com/posts?userId=1', route =>
		route.fulfill({ json: [] }))

	await page.goto('/')

	const root = page.getByRole('main').locator('> div')
	const requestHeading = page.locator('#request-flow [data-reveal="up"]')

	await expect(root).toHaveAttribute('data-motion', 'ready')
	await expect(requestHeading).not.toHaveAttribute('data-visible')
	await requestHeading.scrollIntoViewIfNeeded()
	await expect(requestHeading).toHaveAttribute('data-visible', 'true')
})
