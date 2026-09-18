import type { MetaFunction } from 'react-router'

import { useService } from '@/app/container/container.context'
import { TranslateConfigStore } from '@/features/translateConfig/model/translateConfig.store'
import { TranslateConfigEntry } from '@/features/translateConfig/translateConfig.entry'
import { TranslateConfigInjector } from '@/features/translateConfig/translateConfig.injector'
import { APP_CONFIG } from '@/shared/config'
import { HowItWorks } from '@/widgets/HowItWorks/HowItWorks'
import { PageFooter } from '@/widgets/PageFooter/PageFooter'
import { PrivacyBanner } from '@/widgets/PrivacyBanner/PrivacyBanner'
import { TranslatorPanel } from '@/widgets/TranslatorPanel/TranslatorPanel'

export const meta: MetaFunction = () => [
	{ title: `${APP_CONFIG.name} — convert between 12 MCP clients` },
	{ name: 'description', content: APP_CONFIG.description },
]

export default function HomePage() {
	const store = useService(TranslateConfigStore)

	return (
		<>
			<TranslatorPanel>
				<TranslateConfigInjector value={{ store }}>
					<TranslateConfigEntry />
				</TranslateConfigInjector>
			</TranslatorPanel>
			<HowItWorks />
			<PrivacyBanner />
			<PageFooter />
		</>
	)
}
