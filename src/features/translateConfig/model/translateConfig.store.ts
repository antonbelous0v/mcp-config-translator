import type { TranslationPreferences } from './translationPreferences'
import type { McpClientId } from '@/entities/mcpClient/model/mcpClient.types'
import { inject } from '@needle-di/core'
import { action, atom, computed, wrap } from '@reatom/core'
import { detectMcpClient } from '@/entities/mcpClient/model/detectMcpClient'
import { mcpClientIds, mcpClients } from '@/entities/mcpClient/model/mcpClient.catalog'
import { McpConfigError } from '@/entities/mcpConfig/model/McpConfigError'
import { TranslationService } from '../services/translation.service'
import { configExamples } from './examples'
import { TRANSLATION_OUTPUT_GATEWAY, TRANSLATION_PREFERENCES_REPOSITORY } from './translation.ports'
import { defaultTranslationPreferences } from './translationPreferences'

const emptyTranslationMessage = 'Paste a configuration to begin'

export class TranslateConfigStore {
	constructor(
		private readonly translationService = inject(TranslationService),
		private readonly preferencesRepository = inject(TRANSLATION_PREFERENCES_REPOSITORY),
		private readonly outputGateway = inject(TRANSLATION_OUTPUT_GATEWAY),
	) {}

	input = atom('')
	source = atom<McpClientId>(defaultTranslationPreferences.source)
	targets = atom<McpClientId[]>(defaultTranslationPreferences.targets)
	results = atom<ReturnType<TranslationService['translate']>>([])
	outputMessage = atom(emptyTranslationMessage)
	sourceHint = atom('Source is detected after paste')
	copyLabel = atom('Copy')
	hasError = atom(false)
	conversionVersion = atom(0)
	target = computed(() => this.targets()[0])
	result = computed(() => this.results().find(result => result.targetId === this.target()) ?? null)
	canConvert = computed(() => Boolean(this.input().trim()))
	message = computed(() => this.targets().length > 1 && this.results().length
		? `${this.results().length} configs ready · Previewing ${mcpClients[this.target()].name}`
		: this.outputMessage())

	initialize = action(() => {
		this.applyPreferences(this.preferencesRepository.load())
	}, 'translator.initialize')

	observePreferences() {
		return this.preferencesRepository.subscribe(preferences => wrap(() => this.applyPreferences(preferences)))
	}

	run = action((
		nextInput = this.input(),
		nextSource = this.source(),
		nextTargets = this.targets(),
	) => {
		try {
			if (!nextInput.trim()) {
				this.resetOutput(emptyTranslationMessage)
				return
			}
			const results = this.translationService.translate(nextInput, nextSource, nextTargets)
			const serverCount = results[0]?.serverCount ?? 0
			this.results.set(results)
			this.outputMessage.set(nextTargets.length === 1
				? `${serverCount} ${serverCount === 1 ? 'server' : 'servers'} converted`
				: `${results.length} configs ready`)
			this.hasError.set(false)
			this.conversionVersion.set(this.conversionVersion() + 1)
		}
		catch (error) {
			this.results.set([])
			this.outputMessage.set(error instanceof McpConfigError ? error.message : 'Conversion failed unexpectedly.')
			this.hasError.set(true)
		}
	}, 'translator.run')

	changeSource = action((source: McpClientId) => {
		const targets = normalizeTargets(this.targets(), source)
		this.applyPreferences({ source, targets }, true)
		this.sourceHint.set(`Selected ${mcpClients[source].name}`)
		this.resetOutput()
	}, 'translator.changeSource')

	changeTarget = action((target: McpClientId) => {
		const currentTargets = this.targets()
		const targets = currentTargets.length > 1
			? [target, ...currentTargets.filter(id => id !== target)]
			: [target]
		this.applyPreferences({ source: this.source(), targets }, true)
		if (this.results().length && currentTargets.length === 1) {
			this.run(this.input(), this.source(), targets)
		}
		else if (!this.results().length) {
			this.resetOutput()
		}
	}, 'translator.changeTarget')

	changeTargets = action((targets: McpClientId[]) => {
		const nextTargets = normalizeTargets(targets, this.source())
		this.applyPreferences({ source: this.source(), targets: nextTargets }, true)
		if (this.results().length) {
			this.run(this.input(), this.source(), nextTargets)
		}
		else {
			this.resetOutput()
		}
	}, 'translator.changeTargets')

	changeInput = action((input: string) => {
		this.input.set(input)
		const detected = detectMcpClient(input)
		if (detected) {
			this.applyPreferences({ source: detected, targets: normalizeTargets(this.targets(), detected) }, true)
			this.sourceHint.set(detected === 'cursor'
				? 'Detected shared MCP JSON — verify source'
				: `Detected ${mcpClients[detected].name}`)
		}
		else {
			this.sourceHint.set(input.trim() ? 'Waiting for a valid configuration' : 'Source is detected after paste')
		}
		this.resetOutput(input.trim() ? 'Ready to convert' : emptyTranslationMessage)
	}, 'translator.changeInput')

	swap = action(() => {
		const source = this.target()
		const targets = [this.source()]
		if (!this.input().trim()) {
			this.applyPreferences({ source, targets }, true)
			this.sourceHint.set(`Selected ${mcpClients[source].name}`)
			this.resetOutput(emptyTranslationMessage)
			return
		}

		let input: string
		try {
			input = this.result()?.output ?? this.translationService.translateOne(this.input(), this.source(), this.target()).output
		}
		catch {
			this.run()
			return
		}
		this.applyPreferences({ source, targets }, true)
		this.input.set(input)
		this.sourceHint.set(`Converted output from ${mcpClients[source].name}`)
		this.run(input, source, targets)
	}, 'translator.swap')

	loadExample = action(() => {
		this.input.set(configExamples[this.source()])
		this.sourceHint.set(`Example for ${mcpClients[this.source()].name}`)
		this.resetOutput()
	}, 'translator.loadExample')

	clear = action(() => {
		this.input.set('')
		this.sourceHint.set('Source is detected after paste')
		this.resetOutput(emptyTranslationMessage)
	}, 'translator.clear')

	copy = action(async () => {
		const result = this.result()
		if (!result) {
			return
		}
		try {
			await wrap(this.outputGateway.copy(result.output))
			this.copyLabel.set('Copied')
			window.setTimeout(() => wrap(() => this.copyLabel.set('Copy')), 1600)
		}
		catch {
			this.copyLabel.set('Copy failed')
		}
	}, 'translator.copy')

	download = action(() => {
		const result = this.result()
		if (this.results().length > 1) {
			this.outputGateway.downloadArchive(this.results())
		}
		else if (result) {
			this.outputGateway.download(result)
		}
	}, 'translator.download')

	private applyPreferences(preferences: TranslationPreferences, persist = false) {
		this.source.set(preferences.source)
		this.targets.set(preferences.targets)
		if (persist) {
			this.preferencesRepository.save(preferences)
		}
	}

	private resetOutput(message = 'Ready to convert') {
		this.results.set([])
		this.outputMessage.set(message)
		this.copyLabel.set('Copy')
		this.hasError.set(false)
	}
}

function normalizeTargets(targets: McpClientId[], source: McpClientId) {
	const available = [...new Set(targets)].filter(id => id !== source)
	return available.length ? available : [nextClient(source)]
}

function nextClient(client: McpClientId) {
	return mcpClientIds[(mcpClientIds.indexOf(client) + 1) % mcpClientIds.length]
}
