import { expect, test } from '@playwright/test'

test('search filters the catalog and handles an empty result', async ({ page }) => {
	await page.goto('/')

	const search = page.getByRole('textbox', { name: 'Explore the engineering defaults' })
	await search.fill('A demo designed to disappear')

	await expect(page.getByRole('heading', { name: 'A demo designed to disappear' })).toBeVisible()
	await expect(page.getByRole('button', { name: 'Select block' })).toHaveCount(1)

	await search.fill('does-not-exist')
	await expect(page.getByText('No template blocks found.')).toBeVisible()
})
