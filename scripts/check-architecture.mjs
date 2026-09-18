import { access, readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const requiredPaths = [
	'AGENTS.md',
	'skills/frontend-architecture/SKILL.md',
	'src/app/container/container.context.ts',
	'src/app/container/container.provider.tsx',
	'src/app/container/container.ts',
	'src/shared/lib/react.ts',
]

await Promise.all(requiredPaths.map(path => access(resolve(root, path))))

const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
if (!packageJson.dependencies?.['@needle-di/core']) {
	throw new Error('Architecture kernel requires @needle-di/core.')
}

const containerSource = await readFile(resolve(root, 'src/app/container/container.ts'), 'utf8')
if (!containerSource.includes('\'../../features/**/*.provider.ts\'')) {
	throw new Error('DI container must discover feature provider modules.')
}

const uiFiles = (await listFiles(resolve(root, 'src/features')))
	.filter(path => /\/ui\/.*\.[jt]sx?$/u.test(path))
const forbiddenImport = /from\s+['"][^'"]*(?:\.injector|\.store|\/(?:data|repository|services)\/)[^'"]*['"]/u
const violations = []

for (const path of uiFiles) {
	if (forbiddenImport.test(await readFile(path, 'utf8'))) {
		violations.push(path.replace(`${root}/`, ''))
	}
}

if (violations.length) {
	throw new Error(`Feature UI imports orchestration internals:\n${violations.join('\n')}`)
}

async function listFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true })
	const paths = await Promise.all(entries.map((entry) => {
		const path = resolve(directory, entry.name)
		return entry.isDirectory() ? listFiles(path) : [path]
	}))
	return paths.flat()
}
