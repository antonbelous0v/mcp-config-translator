import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import process from 'node:process'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const root = fileURLToPath(new URL('..', import.meta.url))
const colorSchemes = ['light', 'dark', 'auto']
const primaryColors = [
	'dark',
	'gray',
	'red',
	'pink',
	'grape',
	'violet',
	'indigo',
	'blue',
	'cyan',
	'teal',
	'green',
	'lime',
	'yellow',
	'orange',
]
const demoDependencies = ['@reatom/core', '@reatom/react']
const templateOnlyPaths = ['AUDIT.md', 'scripts/__tests__']
const demoPaths = [
	'src/entities/post',
	'src/entities/templateModule',
	'src/features/postsFeed',
	'src/features/templateCatalog',
	'src/pages/_index/home.page.module.css',
	'src/pages/_index/home.page.tsx',
	'src/shared/api',
	'src/shared/dto/postDto.types.ts',
	'src/shared/dto/templateItemDto.types.ts',
	'e2e/posts-feed',
	'e2e/template-catalog',
]

await main()

async function main() {
	try {
		const { values } = parseArgs({
			options: {
				'color-scheme': { type: 'string' },
				'demo': { type: 'string' },
				'description': { type: 'string' },
				'help': { type: 'boolean', short: 'h' },
				'lang': { type: 'string' },
				'name': { type: 'string' },
				'primary-color': { type: 'string' },
				'title': { type: 'string' },
				'yes': { type: 'boolean', short: 'y' },
			},
			strict: true,
		})

		if (values.help) {
			console.log(getHelp())
			return
		}

		const options = await resolveOptions(values)
		validateOptions(options)
		await setupProject(options)
		printSummary(options)
	}
	catch (error) {
		console.error(error instanceof Error ? error.message : error)
		process.exitCode = 1
	}
}

async function resolveOptions(values) {
	const interactive = process.stdin.isTTY && !values.yes
	const defaultName = normalizeDefaultPackageName(basename(process.cwd()))

	if (!interactive) {
		const name = values.name ?? defaultName
		const title = values.title ?? packageNameToTitle(name)

		return {
			colorScheme: values['color-scheme'] ?? 'dark',
			demo: values.demo ?? 'remove',
			description: values.description ?? `${title} web application.`,
			language: values.lang ?? 'en',
			name,
			primaryColor: values['primary-color'] ?? 'lime',
			title,
		}
	}

	const prompts = createInterface({ input: process.stdin, output: process.stdout })

	try {
		const name = values.name ?? await ask(prompts, 'Package name', defaultName)
		const title = values.title ?? await ask(prompts, 'Application title', packageNameToTitle(name))

		return {
			colorScheme: values['color-scheme'] ?? await ask(prompts, `Color scheme (${colorSchemes.join('/')})`, 'dark'),
			demo: values.demo ?? await ask(prompts, 'Example domain (remove/keep)', 'remove'),
			description: values.description ?? await ask(prompts, 'SEO description', `${title} web application.`),
			language: values.lang ?? await ask(prompts, 'Document language', 'en'),
			name,
			primaryColor: values['primary-color'] ?? await ask(prompts, `Mantine primary color (${primaryColors.join('/')})`, 'lime'),
			title,
		}
	}
	finally {
		prompts.close()
	}
}

async function ask(prompts, label, fallback) {
	const answer = (await prompts.question(`${label} [${fallback}]: `)).trim()
	return answer || fallback
}

function validateOptions(options) {
	if (!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(options.name) || options.name.length > 214) {
		throw new Error(`Invalid npm package name: ${options.name}`)
	}
	if (!options.title.trim()) {
		throw new Error('Application title cannot be empty.')
	}
	if (!options.description.trim()) {
		throw new Error('SEO description cannot be empty.')
	}
	if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(options.language)) {
		throw new Error(`Invalid document language: ${options.language}`)
	}
	if (!colorSchemes.includes(options.colorScheme)) {
		throw new Error(`Color scheme must be one of: ${colorSchemes.join(', ')}.`)
	}
	if (!primaryColors.includes(options.primaryColor)) {
		throw new Error(`Primary color must be one of: ${primaryColors.join(', ')}.`)
	}
	if (!['remove', 'keep'].includes(options.demo)) {
		throw new Error('Demo mode must be either remove or keep.')
	}
}

async function setupProject(options) {
	for (const templatePath of templateOnlyPaths) {
		await rm(resolve(root, templatePath), { force: true, recursive: true })
	}

	if (options.demo === 'remove') {
		for (const demoPath of demoPaths) {
			await rm(resolve(root, demoPath), { force: true, recursive: true })
		}
		await writeCleanHomePage()
	}

	await writeAppConfig(options)
	await updatePackageJson(options)
	await updatePackageLock(options)
	await writeReadme(options)
	await rm(resolve(root, 'scripts/setup-template.mjs'), { force: true })
}

async function writeCleanHomePage() {
	const homePageDir = resolve(root, 'src/pages/_index')
	await mkdir(homePageDir, { recursive: true })
	await writeFile(
		resolve(homePageDir, 'route.tsx'),
		`import { APP_CONFIG } from '@/shared/config'
import { HomePage } from './home.page'

export default function HomeRoute() {
\treturn (
\t\t<>
\t\t\t<title>{APP_CONFIG.name}</title>
\t\t\t<meta name="description" content={APP_CONFIG.description} />
\t\t\t<HomePage />
\t\t</>
\t)
}
`,
	)
	await writeFile(
		resolve(homePageDir, 'home.page.tsx'),
		`import { Stack, Text, Title } from '@mantine/core'
import { APP_CONFIG } from '@/shared/config'

export function HomePage() {
\treturn (
\t\t<Stack gap="sm" py="xl">
\t\t\t<Title order={1}>{APP_CONFIG.name}</Title>
\t\t\t<Text c="dimmed">Start with a bounded context and one complete vertical slice.</Text>
\t\t</Stack>
\t)
}
`,
	)
}

async function writeAppConfig(options) {
	await writeFile(
		resolve(root, 'src/shared/config.ts'),
		`export const APP_CONFIG = {
\tcolorScheme: ${toTsString(options.colorScheme)},
\tdescription: ${toTsString(options.description)},
\tlanguage: ${toTsString(options.language)},
\tname: ${toTsString(options.title)},
\tprimaryColor: ${toTsString(options.primaryColor)},
} as const
`,
	)
}

async function updatePackageJson(options) {
	const packageJsonPath = resolve(root, 'package.json')
	const packageJson = await readJson(packageJsonPath)

	packageJson.name = options.name
	delete packageJson.scripts['template:setup']
	if (options.demo === 'remove') {
		for (const dependency of demoDependencies) {
			delete packageJson.dependencies[dependency]
		}
		packageJson.knip = { ignore: ['src/shared/lib/react.ts'] }
	}

	await writeJson(packageJsonPath, packageJson)
}

async function updatePackageLock(options) {
	const packageLockPath = resolve(root, 'package-lock.json')
	const packageLock = await readJson(packageLockPath)

	packageLock.name = options.name
	if (packageLock.packages?.['']) {
		packageLock.packages[''].name = options.name
		if (options.demo === 'remove') {
			for (const dependency of demoDependencies) {
				delete packageLock.packages[''].dependencies?.[dependency]
				delete packageLock.packages[`node_modules/${dependency}`]
			}
		}
	}

	await writeJson(packageLockPath, packageLock)
}

async function writeReadme(options) {
	const exampleStatus = options.demo === 'keep'
		? 'The example domain is retained as a working architecture reference.'
		: 'The template example was removed; the application starts from a clean home page.'

	await writeFile(
		resolve(root, 'README.md'),
		`# ${options.title}

${options.description}

${exampleStatus}

## Development

\`\`\`bash
npm ci
npm run dev
\`\`\`

## Scripts

- \`npm run dev\` — React Router SSR development server.
- \`npm run typecheck\` — generate route types and run TypeScript.
- \`npm run build\` — create production client and server builds.
- \`npm start\` — serve the production build.
- \`npm test\` — run Vitest in watch mode.
- \`npm run test:unit\` — run unit and integration tests once.
- \`npm run test:e2e\` — run SSR, route-error, hydration, and accessibility E2E.
- \`npm run lint\` — run type-aware ESLint.
- \`npm run lint:fix\` — apply safe ESLint fixes.
- \`npm run knip\` — find unused files, exports, and dependencies.
- \`npm run check\` — run the local CI quality gate.

## Conventions

- Product metadata and theme defaults live in \`src/shared/config.ts\`.
- Routes are discovered from \`src/pages\`; add optional page-local \`navigation.ts\`
  metadata to expose a route in the navbar.
- The DI container discovers named \`provider\` functions from \`*.provider.ts\` modules under
  \`entities\`, \`features\`, and \`shared\`. React code resolves tokens with
  \`useService\` from \`src/app/container/container.context.ts\` only at app/page
  composition roots; feature entries receive narrow dependencies via injectors.
- Keep feature views props-driven. Stores, services, repositories, adapters, and
  injectors belong behind the feature entry, not inside \`features/*/ui\`.
- Put SVG icons in \`src/shared/assets/icons\` and render them with \`SvgIcon\`
  from \`src/shared/ui/SvgIcon.tsx\`. Nested directories become name prefixes.
- Group Playwright specs by product area under \`e2e/\`; universal checks stay
  in \`e2e/smoke/\`.
- Follow \`skills/frontend-architecture/SKILL.md\` when adding a vertical slice
  or reviewing layer boundaries.

Run one unit file with \`npm run test:unit -- path/to/file.test.ts\` and one E2E
file with \`npm run test:e2e -- e2e/area/flow.spec.ts\`.
`,
	)
}

function normalizeDefaultPackageName(value) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9._-]+/g, '-')
		.replace(/^[._-]+|[._-]+$/g, '')
		|| 'new-project'
}

function packageNameToTitle(value) {
	return value
		.split('/')
		.at(-1)
		.split(/[-_]/)
		.filter(Boolean)
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')
}

function toTsString(value) {
	return `'${value.replaceAll('\\', '\\\\').replaceAll('\'', '\\\'').replaceAll('\n', '\\n')}'`
}

async function readJson(path) {
	return JSON.parse(await readFile(path, 'utf8'))
}

async function writeJson(path, value) {
	await writeFile(path, `${JSON.stringify(value, null, '\t')}\n`)
}

function printSummary(options) {
	console.log(`Configured ${options.title} (${options.name}).`)
	console.log(`Language: ${options.language}; theme: ${options.colorScheme}/${options.primaryColor}; demo: ${options.demo}.`)
	console.log('Start with npm run dev.')
}

function getHelp() {
	return `Usage: npm run template:setup -- [options]

In an interactive terminal, omitting --yes prompts for missing options.

Options:
  --name <name>                 npm package name
  --title <title>               user-facing application name
  --description <text>          default SEO description
  --lang <tag>                  document language, for example en or uk-UA
  --color-scheme <value>        light, dark, or auto
  --primary-color <value>       Mantine default color name
  --demo <remove|keep>          remove or retain the example domain
  -y, --yes                     accept defaults for missing options
  -h, --help                    show this help
`
}
