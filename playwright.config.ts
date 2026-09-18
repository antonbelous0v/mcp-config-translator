import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const isCI = Boolean(process.env.CI)
const port = Number(process.env.PLAYWRIGHT_PORT ?? 4173)

export default defineConfig({
	testDir: './e2e',
	testMatch: '**/*.spec.ts',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 1 : 0,
	workers: isCI ? 1 : undefined,
	reporter: isCI
		? [['github'], ['html', { open: 'never' }]]
		: 'list',
	timeout: 30_000,

	use: {
		baseURL: `http://localhost:${port}`,
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	webServer: {
		command: isCI ? 'npm start' : 'npm run build && npm start',
		env: { PORT: String(port) },
		port,
		reuseExistingServer: false,
		timeout: 60_000,
	},
})
