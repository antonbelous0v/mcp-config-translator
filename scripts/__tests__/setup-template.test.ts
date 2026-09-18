import { execFile } from 'node:child_process'
import { access, cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, relative, resolve, sep } from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import { expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const repositoryRoot = resolve(import.meta.dirname, '../..')
const excludedDirectories = new Set([
	'.git',
	'.react-router',
	'build',
	'node_modules',
	'playwright-report',
	'test-results',
])

it('creates a configured clean product', async () => {
	const { fixtureRoot, temporaryRoot } = await createFixture('clean')

	try {
		await runSetup(fixtureRoot, [
			'--yes',
			'--name',
			'field-notes',
			'--title',
			'Field Notes',
			'--description',
			'Your team\'s private notes.',
			'--lang',
			'uk-UA',
			'--color-scheme',
			'auto',
			'--primary-color',
			'violet',
			'--demo',
			'remove',
		])

		const packageJson = await readPackageJson(fixtureRoot)
		const config = await readFile(resolve(fixtureRoot, 'src/shared/config.ts'), 'utf8')
		const route = await readFile(resolve(fixtureRoot, 'src/pages/_index/route.tsx'), 'utf8')

		expect(packageJson.name).toBe('field-notes')
		expect(packageJson.scripts).not.toHaveProperty('template:setup')
		expect(packageJson.dependencies).not.toHaveProperty('@reatom/core')
		expect(packageJson.dependencies).toHaveProperty('@needle-di/core')
		expect(packageJson.knip?.ignore).toContain('src/shared/lib/react.ts')
		expect(config).toContain('description: \'Your team\\\'s private notes.\'')
		expect(config).toContain('language: \'uk-UA\'')
		expect(config).toContain('name: \'Field Notes\'')
		expect(config).toContain('primaryColor: \'violet\'')
		expect(await readFile(resolve(fixtureRoot, 'README.md'), 'utf8')).toContain('src/shared/assets/icons')
		expect(await readFile(resolve(fixtureRoot, 'src/app/container/container.context.ts'), 'utf8'))
			.toContain('export const useService')
		expect(await readFile(resolve(fixtureRoot, 'src/shared/lib/react.ts'), 'utf8'))
			.toContain('export function createDi')
		expect(route).toContain('import { HomePage } from \'./home.page\'')
		expect(route).not.toContain('@mantine/core')
		await expect(access(resolve(fixtureRoot, 'src/entities/templateModule'))).rejects.toThrow()
		await expect(access(resolve(fixtureRoot, 'src/entities/post'))).rejects.toThrow()
		await expect(access(resolve(fixtureRoot, 'src/pages/_index/home.page.tsx'))).resolves.toBeUndefined()
		await expect(access(resolve(fixtureRoot, 'e2e/posts-feed'))).rejects.toThrow()
		await expect(access(resolve(fixtureRoot, 'src/shared/api'))).rejects.toThrow()
		await expect(access(resolve(fixtureRoot, 'skills/frontend-architecture/SKILL.md'))).resolves.toBeUndefined()
		await expect(access(resolve(fixtureRoot, 'scripts/__tests__'))).rejects.toThrow()
		await expect(access(resolve(fixtureRoot, 'scripts/setup-template.mjs'))).rejects.toThrow()
		await runArchitectureCheck(fixtureRoot)
	}
	finally {
		await rm(temporaryRoot, { force: true, recursive: true })
	}
})

it('can retain the working example domain', async () => {
	const { fixtureRoot, temporaryRoot } = await createFixture('demo')

	try {
		await runSetup(fixtureRoot, [
			'--yes',
			'--name',
			'catalog-lab',
			'--demo',
			'keep',
		])

		const packageJson = await readPackageJson(fixtureRoot)

		expect(packageJson.name).toBe('catalog-lab')
		expect(packageJson.dependencies).toHaveProperty('@reatom/core')
		await expect(access(resolve(fixtureRoot, 'src/entities/templateModule'))).resolves.toBeUndefined()
		await expect(access(resolve(fixtureRoot, 'src/entities/post'))).resolves.toBeUndefined()
		await expect(access(resolve(fixtureRoot, 'e2e/posts-feed'))).resolves.toBeUndefined()
		await expect(access(resolve(fixtureRoot, 'e2e/template-catalog'))).resolves.toBeUndefined()
		await runArchitectureCheck(fixtureRoot)
		await writeFile(
			resolve(fixtureRoot, 'src/features/templateCatalog/ui/forbidden.ts'),
			'import { TemplateModuleStore } from \'@/entities/templateModule/templateModule.store\'\n',
		)
		await expect(runArchitectureCheck(fixtureRoot)).rejects.toThrow()
	}
	finally {
		await rm(temporaryRoot, { force: true, recursive: true })
	}
})

async function createFixture(name: string) {
	const temporaryRoot = await mkdtemp(join(tmpdir(), `js-template-setup-${name}-`))
	const fixtureRoot = join(temporaryRoot, name)

	await cp(repositoryRoot, fixtureRoot, {
		recursive: true,
		filter: source => !excludedDirectories.has(relative(repositoryRoot, source).split(sep)[0]),
	})

	return { fixtureRoot, temporaryRoot }
}

async function runSetup(fixtureRoot: string, args: string[]) {
	await execFileAsync(process.execPath, [
		resolve(fixtureRoot, 'scripts/setup-template.mjs'),
		...args,
	], { cwd: fixtureRoot })
}

async function runArchitectureCheck(fixtureRoot: string) {
	await execFileAsync(process.execPath, [
		resolve(fixtureRoot, 'scripts/check-architecture.mjs'),
	], { cwd: fixtureRoot })
}

async function readPackageJson(fixtureRoot: string) {
	return JSON.parse(await readFile(resolve(fixtureRoot, 'package.json'), 'utf8')) as {
		name: string
		scripts: Record<string, string>
		dependencies: Record<string, string>
		knip?: { ignore: string[] }
	}
}
