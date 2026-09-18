import { Badge, Box, Button, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useService } from '@/app/container/container.context'
import { PostsStore } from '@/entities/post/posts.store'
import { TemplateModuleStore } from '@/entities/templateModule/templateModule.store'
import { PostsFeedEntry } from '@/features/postsFeed/postsFeed.entry'
import { PostsFeedInjector } from '@/features/postsFeed/postsFeed.injector'
import { TemplateCatalogEntry } from '@/features/templateCatalog/templateCatalog.entry'
import { TemplateCatalogInjector } from '@/features/templateCatalog/templateCatalog.injector'
import styles from './home.page.module.css'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const requestPath = [
	['01', 'Page', 'compose the use case'],
	['02', 'Feature', 'own the interaction'],
	['03', 'View model', 'expose async state'],
	['04', 'Service', 'map DTOs to domain'],
	['05', 'Repository', 'own the API contract'],
	['06', 'HttpClient', 'handle transport'],
]

const engineeringDefaults = [
	'SSR by default',
	'File-based routes',
	'Typed data flow',
	'Request-scoped DI',
	'Scoped styles',
	'CI-ready checks',
]

function useScrollReveal() {
	const rootRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) {
			return
		}

		const elements = root.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]')
		if (
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
			|| !('IntersectionObserver' in window)
		) {
			return
		}

		root.dataset.motion = 'ready'
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					(entry.target as HTMLElement).dataset.visible = 'true'
					observer.unobserve(entry.target)
				}
			}
		}, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })

		elements.forEach(element => observer.observe(element))
		return () => observer.disconnect()
	}, [])

	return rootRef
}

export const HomePage = reatomComponent(() => {
	const pageRef = useScrollReveal()
	const templateModuleStore = useService(TemplateModuleStore)
	const postsStore = useService(PostsStore)
	const hydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
	const selectedItems = hydrated ? templateModuleStore.selectedItems() : []

	return (
		<Stack ref={pageRef} className={styles.page} gap={0}>
			<section className={styles.homeHero} aria-labelledby="home-title">
				<div className={styles.heroCopy}>
					<Text className={styles.kicker}>React 19 / SSR / resettable</Text>
					<Title order={1} id="home-title" className={styles.heroTitle}>
						Keep the architecture. Delete the demo.
					</Title>
					<Text className={styles.heroLead}>
						Start with working SSR, enforceable layer boundaries, DI, typed data flow,
						and production checks. Study the reference app, then remove it cleanly.
					</Text>
					<Group mt="xl" gap="sm">
						<Button component="a" href="#request-flow" size="md">Trace a real request</Button>
						<Button component="a" href="#playground" variant="default" size="md">
							Test the state flow
						</Button>
					</Group>
				</div>

				<aside id="quick-start" className={styles.quickStart} aria-label="Quick start commands">
					<div className={styles.quickStartBar}>
						<span>quick-start</span>
						<span>zsh</span>
					</div>
					<div className={styles.quickStartBody}>
						<p>
							<span>$</span>
							{' '}
							npm ci
						</p>
						<p>
							<span>$</span>
							{' '}
							npm run template:setup
						</p>
						<p>
							<span>$</span>
							{' '}
							npm run dev
						</p>
						<div className={styles.quickStartResult}>
							<span>ready</span>
							<strong>localhost:5173</strong>
						</div>
					</div>
				</aside>
			</section>

			<div className={styles.stackStrip} data-reveal="up" aria-label="Engineering defaults">
				{engineeringDefaults.map(item => <span key={item}>{item}</span>)}
			</div>

			<section id="request-flow" className={styles.section} aria-labelledby="request-flow-title">
				<div className={styles.sectionHeading} data-reveal="up">
					<div>
						<Text className={styles.kicker}>Proof, not promises</Text>
						<Title order={2} id="request-flow-title">One live request. Every boundary visible.</Title>
					</div>
					<Text>
						A JSONPlaceholder response crosses the HTTP client, repository, service,
						and Reatom view model before React sees it. Each boundary has one job.
					</Text>
				</div>

				<div className={styles.requestLab}>
					<ol className={styles.requestPath} data-reveal-group="left" aria-label="Request architecture">
						{requestPath.map(([number, name, detail]) => (
							<li key={name}>
								<span>{number}</span>
								<div>
									<strong>{name}</strong>
									<small>{detail}</small>
								</div>
							</li>
						))}
					</ol>

					<div className={styles.requestPreview} data-reveal="right">
						<div className={styles.requestPreviewBar}>
							<span>live API response</span>
							<Badge className={styles.requestBadge} variant="light">JSONPlaceholder</Badge>
						</div>
						{hydrated
							? (
									<PostsFeedInjector value={{ postsStore }}>
										<PostsFeedEntry />
									</PostsFeedInjector>
								)
							: (
									<Box className={styles.apiLoading} role="status" aria-label="Loading posts">
										<Loader aria-hidden="true" size="sm" />
									</Box>
								)}
					</div>
				</div>
			</section>

			<section id="playground" className={styles.section} aria-labelledby="playground-title">
				<div className={styles.sectionHeading} data-reveal="up">
					<div>
						<Text className={styles.kicker}>A second proof</Text>
						<Title order={2} id="playground-title">Same rules. Different side effect.</Title>
					</div>
					<Text>
						Search, selection, and persistence follow the same ownership rules against
						local storage. The examples are disposable. The boundaries are not.
					</Text>
				</div>

				<div className={styles.selectionPanel} data-reveal="up">
					<div>
						<span>persisted selection</span>
						<strong>
							{selectedItems.length
								? selectedItems.map(item => item.title).join(' / ')
								: 'No blocks selected yet.'}
						</strong>
					</div>
					<Button
						variant="subtle"
						disabled={!selectedItems.length}
						onClick={wrap(templateModuleStore.clearSelected)}
					>
						Clear
					</Button>
				</div>

				<Box mt="lg" data-reveal="up">
					{hydrated
						? (
								<TemplateCatalogInjector value={{ templateModuleStore }}>
									<TemplateCatalogEntry />
								</TemplateCatalogInjector>
							)
						: (
								<Box role="status" aria-label="Loading catalog">
									<Loader aria-hidden="true" size="sm" />
								</Box>
							)}
				</Box>
			</section>

			<section className={styles.deliveryStrip} aria-labelledby="delivery-title">
				<div data-reveal="left">
					<Text className={styles.kicker}>The delivery contract</Text>
					<Title order={2} id="delivery-title">Prove it before review.</Title>
				</div>
				<code data-reveal="right">
					<span>$</span>
					{' '}
					npm run check
					<br />
					<span>$</span>
					{' '}
					npm run test:e2e
				</code>
				<ul data-reveal="up" aria-label="Quality gates">
					<li>ESLint + Stylelint</li>
					<li>Vitest</li>
					<li>TypeScript</li>
					<li>SSR build</li>
					<li>Knip</li>
					<li>Playwright + Axe</li>
				</ul>
			</section>
		</Stack>
	)
}, 'HomePage')
