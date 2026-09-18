import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('home page has no automatically detectable accessibility violations', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.goto('/')
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

	const { violations } = await new AxeBuilder({ page }).analyze()

	expect(violations).toEqual([])
})

test('keyboard users can bypass repeated navigation', async ({ page }) => {
	await page.goto('/')
	await page.keyboard.press('Tab')

	const skipLink = page.getByRole('link', { name: 'Skip to content' })
	await expect(skipLink).toBeFocused()

	await skipLink.press('Enter')
	await expect(page.getByRole('main')).toBeFocused()
})
