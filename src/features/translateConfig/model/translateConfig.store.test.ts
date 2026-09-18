import type { TranslationOutputGateway, TranslationPreferencesRepository } from './translation.ports'
import { describe, expect, it, vi } from 'vitest'
import { TranslationService } from '../services/translation.service'
import { TranslateConfigStore } from './translateConfig.store'

const cursorConfig = '{"mcpServers":{"local":{"command":"node","args":["server.js"]}}}'

function createStore() {
	const preferences: TranslationPreferencesRepository = {
		load: () => ({ source: 'cursor', targets: ['codex'] }),
		save: vi.fn(),
		subscribe: () => () => {},
	}
	const output: TranslationOutputGateway = {
		copy: vi.fn().mockResolvedValue(undefined),
		download: vi.fn(),
		downloadArchive: vi.fn(),
	}
	const service = new TranslationService()
	return { store: new TranslateConfigStore(service, preferences, output), service }
}

describe('translate config store', () => {
	it('reconverts a completed single output when its target changes', () => {
		const { store, service } = createStore()
		const translate = vi.spyOn(service, 'translate')
		store.initialize()
		store.changeInput(cursorConfig)
		store.run()
		store.changeTarget('pi')

		expect(store.targets()).toEqual(['pi'])
		expect(store.result()?.targetId).toBe('pi')
		expect(translate).toHaveBeenCalledTimes(2)
	})

	it('switches a batch preview without rebuilding the batch', () => {
		const { store, service } = createStore()
		const translate = vi.spyOn(service, 'translate')
		store.initialize()
		store.changeInput(cursorConfig)
		store.changeTargets(['codex', 'pi'])
		store.run()
		store.changeTarget('pi')

		expect(store.targets()).toEqual(['pi', 'codex'])
		expect(store.result()?.targetId).toBe('pi')
		expect(store.message()).toBe('2 configs ready · Previewing Pi')
		expect(translate).toHaveBeenCalledTimes(1)
	})
})
