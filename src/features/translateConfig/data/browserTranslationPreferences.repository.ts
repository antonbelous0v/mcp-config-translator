import type { TranslationPreferencesRepository } from '../model/translation.ports'
import type { TranslationPreferences } from '../model/translationPreferences'
import { defaultTranslationPreferences, normalizeTranslationPreferences } from '../model/translationPreferences'

const storageKey = 'app_translator_preferences_v1'

export class BrowserTranslationPreferencesRepository implements TranslationPreferencesRepository {
	load() {
		if (typeof window === 'undefined') {
			return defaultTranslationPreferences
		}
		try {
			const value = window.localStorage.getItem(storageKey)
			return normalizeTranslationPreferences(value ? JSON.parse(value) : null)
		}
		catch {
			return defaultTranslationPreferences
		}
	}

	save(preferences: TranslationPreferences) {
		try {
			window.localStorage.setItem(storageKey, JSON.stringify(preferences))
		}
		catch {
		}
	}

	subscribe(listener: (preferences: TranslationPreferences) => void) {
		if (typeof window === 'undefined') {
			return () => {}
		}
		const handleStorage = (event: StorageEvent) => {
			if (event.key === storageKey) {
				listener(this.load())
			}
		}
		window.addEventListener('storage', handleStorage)
		return () => window.removeEventListener('storage', handleStorage)
	}
}
