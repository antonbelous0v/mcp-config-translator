import type { TargetConfigTranslation } from './translateConfig'
import type { TranslationPreferences } from './translationPreferences'
import { InjectionToken } from '@needle-di/core'

export interface TranslationPreferencesRepository {
	load: () => TranslationPreferences
	save: (preferences: TranslationPreferences) => void
	subscribe: (listener: (preferences: TranslationPreferences) => void) => () => void
}

export const TRANSLATION_PREFERENCES_REPOSITORY = new InjectionToken<TranslationPreferencesRepository>(
	'TRANSLATION_PREFERENCES_REPOSITORY',
)

export interface TranslationOutputGateway {
	copy: (content: string) => Promise<void>
	download: (result: TargetConfigTranslation) => void
	downloadArchive: (results: TargetConfigTranslation[]) => void
}

export const TRANSLATION_OUTPUT_GATEWAY = new InjectionToken<TranslationOutputGateway>(
	'TRANSLATION_OUTPUT_GATEWAY',
)
