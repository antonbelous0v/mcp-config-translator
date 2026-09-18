import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('unknown routes return an accessible 404 page', async ({ page }) => {
	const response = await page.goto('/missing-page')

	expect(response?.status()).toBe(404)
	await expect(page).toHaveTitle(/^Page not found \| .+/)
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
	await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible()

	const { violations } = await new AxeBuilder({ page }).analyze()

	expect(violations).toEqual([])
})
