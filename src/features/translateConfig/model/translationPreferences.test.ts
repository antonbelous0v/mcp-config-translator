import { describe, expect, it } from 'vitest'
import { defaultTranslationPreferences, normalizeTranslationPreferences } from './translationPreferences'

describe('normalizeTranslationPreferences', () => {
	it('keeps valid unique targets and rejects invalid stored state', () => {
		expect(normalizeTranslationPreferences({ source: 'cursor', targets: ['codex', 'pi', 'pi', 'cursor'] })).toEqual({
			source: 'cursor',
			targets: ['codex', 'pi'],
		})
		expect(normalizeTranslationPreferences({ source: 'unknown', targets: [] })).toEqual(defaultTranslationPreferences)
	})
})
