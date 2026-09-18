import type { Container } from '@needle-di/core'
import { BrowserTranslationOutputGateway } from './data/browserTranslationOutput.gateway'
import { BrowserTranslationPreferencesRepository } from './data/browserTranslationPreferences.repository'
import { TranslateConfigStore } from './model/translateConfig.store'
import { TRANSLATION_OUTPUT_GATEWAY, TRANSLATION_PREFERENCES_REPOSITORY } from './model/translation.ports'
import { TranslationService } from './services/translation.service'

export function provider(container: Container) {
	container.bindAll(
		{ provide: TRANSLATION_PREFERENCES_REPOSITORY, useClass: BrowserTranslationPreferencesRepository },
		{ provide: TRANSLATION_OUTPUT_GATEWAY, useClass: BrowserTranslationOutputGateway },
		{ provide: TranslationService, useClass: TranslationService },
		{ provide: TranslateConfigStore, useClass: TranslateConfigStore },
	)
}
