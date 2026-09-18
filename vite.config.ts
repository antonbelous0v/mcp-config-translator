import path from 'node:path'
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
	},
	plugins: [
		reactRouter(),
	],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
		},
	},
})
