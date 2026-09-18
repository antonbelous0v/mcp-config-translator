import { reatomComponent } from '@reatom/react'
import { useEffect } from 'react'
import { mcpClientIds, mcpClients } from '@/entities/mcpClient/model/mcpClient.catalog'
import { useTranslateConfigDeps } from './translateConfig.injector'
import { TranslateConfigForm } from './ui/TranslateConfigForm'

const clients = mcpClientIds.map(id => ({ id, ...mcpClients[id] }))

export const TranslateConfigEntry = reatomComponent(() => {
	const { store } = useTranslateConfigDeps()

	useEffect(() => {
		store.initialize()
		return store.observePreferences()
	}, [store])

	return (
		<TranslateConfigForm translator={{
			clients,
			source: store.source(),
			target: store.target(),
			targets: store.targets(),
			input: store.input(),
			result: store.result(),
			message: store.message(),
			sourceHint: store.sourceHint(),
			copyLabel: store.copyLabel(),
			hasError: store.hasError(),
			conversionVersion: store.conversionVersion(),
			canConvert: store.canConvert(),
			changeSource: store.changeSource,
			changeTarget: store.changeTarget,
			changeTargets: store.changeTargets,
			changeInput: store.changeInput,
			swap: store.swap,
			loadExample: store.loadExample,
			clear: store.clear,
			run: () => store.run(),
			copy: () => void store.copy(),
			download: store.download,
		}}
		/>
	)
}, 'TranslateConfigEntry')
