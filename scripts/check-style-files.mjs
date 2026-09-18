import { readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('../src', import.meta.url))
const globalStyleFiles = new Set(['index.css'])
const files = await collectFiles(sourceRoot)
const sourceFiles = new Set(files)
const styleFiles = files.filter(file => file.endsWith('.css'))

const invalidNames = styleFiles.filter(file =>
	!globalStyleFiles.has(file) && !file.endsWith('.module.css'),
)
const missingOwners = styleFiles
	.filter(file => file.endsWith('.module.css'))
	.filter((file) => {
		const owner = file.slice(0, -'.module.css'.length)
		return !sourceFiles.has(`${owner}.tsx`) && !sourceFiles.has(`${owner}.ts`)
	})

if (invalidNames.length || missingOwners.length) {
	const problems = [
		...invalidNames.map(file => `${file}: local styles must use <owner>.module.css`),
		...missingOwners.map(file => `${file}: expected a colocated owner with the same basename`),
	]
	throw new Error(`Style file contract failed:\n${problems.join('\n')}`)
}

async function collectFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true })
	const nested = await Promise.all(entries.map(async (entry) => {
		const path = join(directory, entry.name)
		return entry.isDirectory() ? collectFiles(path) : [relative(sourceRoot, path).split(sep).join('/')]
	}))

	return nested.flat()
}
