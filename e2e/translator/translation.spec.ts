import { expect, test } from '@playwright/test'

test('converts a Cursor config to Codex and copies the result', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write'])
	await page.goto('/')

	await page.getByLabel('From client').selectOption('cursor')
	await expect(page.getByText('Selected Cursor')).toBeVisible()
	await page.getByLabel('To client').selectOption('codex')
	await page.getByRole('button', { name: 'Load example' }).click()
	await page.getByRole('button', { name: 'Convert config' }).click()

	const output = page.getByRole('textbox', { name: 'Converted config' })
	await expect(output).toHaveValue(/\[mcp_servers\.filesystem\]/)
	await page.getByRole('button', { name: 'Copy' }).click()
	await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
})

test('shows a useful error for malformed input', async ({ page }) => {
	await page.goto('/')

	const source = page.getByRole('textbox', { name: 'Source config' })
	await page.getByLabel('From client').selectOption('cursor')
	await expect(page.getByText('Selected Cursor')).toBeVisible()
	await source.fill('{ invalid')
	await expect(source).toHaveValue('{ invalid')
	await page.getByRole('button', { name: 'Convert config' }).click()

	await expect(page.getByText(/Invalid JSON/)).toBeVisible()
	await expect(page.getByLabel('Converted config')).toHaveAttribute('aria-invalid', 'true')
})
