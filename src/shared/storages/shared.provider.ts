import type { Container } from '@needle-di/core'
import { LocalStoragePersister } from './LocalStoragePersister'
import { KEY_VALUE_STORAGE_TOKEN } from './types'

export function provider(container: Container) {
	container.bindAll({
		provide: KEY_VALUE_STORAGE_TOKEN,
		useClass: LocalStoragePersister,
	})
}
