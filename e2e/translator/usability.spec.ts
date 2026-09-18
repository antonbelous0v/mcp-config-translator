import { expect, test } from '@playwright/test'

test('starts empty and keeps input when the source client changes', async ({ page }) => {
	await page.goto('/')

	const source = page.getByRole('textbox', { name: 'Source config' })
	const convert = page.getByRole('button', { name: 'Convert config' })
	await expect(source).toHaveValue('')
	await expect(page.getByRole('textbox', { name: 'Converted config' })).toHaveValue('')
	await expect(convert).toBeDisabled()

	await page.getByLabel('From client').selectOption('cursor')
	await expect(page.getByText('Selected Cursor')).toBeVisible()
	await source.fill('{"mcpServers":{"local":{"command":"node","args":["server.js"]}}}')
	await page.getByLabel('From client').selectOption('claude-desktop')
	await expect(source).toHaveValue(/"command":"node"/)
	await expect(convert).toBeEnabled()
})

test('detects a pasted configuration and does not inject examples when swapped empty', async ({ page }) => {
	await page.goto('/')
	await page.getByLabel('From client').selectOption('cursor')
	await expect(page.getByText('Selected Cursor')).toBeVisible()

	const source = page.getByRole('textbox', { name: 'Source config' })
	await source.fill('{"mcpServers":{"remote":{"serverUrl":"https://example.com/mcp"}}}')
	await expect(page.getByLabel('From client')).toHaveValue('windsurf')
	await expect(page.getByText('Detected Windsurf')).toBeVisible()

	await page.getByRole('button', { name: 'Clear' }).click()
	await page.getByRole('button', { name: 'Swap source and target clients' }).click()
	await expect(source).toHaveValue('')
	await expect(page.getByRole('textbox', { name: 'Converted config' })).toHaveValue('')
})

test('offers all clients and makes the primary action fill its row', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByLabel('From client').locator('option')).toHaveCount(12)
	const button = page.getByRole('button', { name: 'Convert config' })
	const buttonBox = await button.boundingBox()
	const rowBox = await button.locator('..').boundingBox()
	expect(buttonBox).not.toBeNull()
	expect(rowBox).not.toBeNull()
	expect(Math.abs((buttonBox?.width ?? 0) - (rowBox?.width ?? 0))).toBeLessThan(1)
})

test('converts to multiple remembered targets and downloads a ZIP archive', async ({ page }) => {
	await page.goto('/')
	await page.getByLabel('From client').selectOption('cursor')
	await expect(page.getByText('Selected Cursor')).toBeVisible()
	await page.getByRole('textbox', { name: 'Source config' }).fill('{"mcpServers":{"local":{"command":"node","args":["server.js"]}}}')

	const targetMenu = page.getByLabel('Choose output clients')
	await targetMenu.click()
	await page.getByRole('checkbox', { name: 'Pi' }).check()
	await expect(targetMenu).toContainText('2 outputs')
	await expect(page.getByLabel('Preview client').locator('option')).toHaveCount(2)
	await page.getByRole('button', { name: 'Convert to 2 clients' }).click()
	await expect(page.getByText('2 configs ready · Previewing Codex')).toBeVisible()

	await page.getByLabel('Preview client').selectOption('pi')
	await expect(page.getByText('2 configs ready · Previewing Pi')).toBeVisible()
	await expect(page.getByRole('textbox', { name: 'Output preview' })).toHaveValue(/"mcpServers"/)

	const downloadPromise = page.waitForEvent('download')
	await page.getByRole('button', { name: 'Download ZIP (2)' }).click()
	expect((await downloadPromise).suggestedFilename()).toBe('mcp-configs.zip')

	await page.reload()
	await expect(page.getByLabel('From client')).toHaveValue('cursor')
	await expect(page.getByLabel('Preview client')).toHaveValue('pi')
	await expect(page.getByLabel('Choose output clients')).toContainText('2 outputs')
})

test('reconverts automatically when a single target changes after conversion', async ({ page }) => {
	await page.goto('/')
	await page.getByLabel('From client').selectOption('cursor')
	await page.getByRole('textbox', { name: 'Source config' }).fill('{"mcpServers":{"local":{"command":"node","args":["server.js"]}}}')
	await page.getByRole('button', { name: 'Convert config' }).click()

	await page.getByLabel('To client').selectOption('pi')
	await expect(page.getByText('1 server converted')).toBeVisible()
	await expect(page.getByRole('textbox', { name: 'Converted config' })).toHaveValue(/"mcpServers"/)
	await expect(page.getByLabel('To client')).toHaveValue('pi')
})
