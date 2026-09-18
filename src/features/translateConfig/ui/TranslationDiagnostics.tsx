import type { TranslationDiagnostic } from '@/entities/mcpClient/model/mcpClient.types'
import styles from './TranslationDiagnostics.module.css'

export function TranslationDiagnostics({ diagnostics }: { diagnostics: TranslationDiagnostic[] }) {
	if (!diagnostics.length) {
		return null
	}

	return (
		<section className={styles.root} aria-labelledby="diagnostics-heading">
			<div className={styles.heading}>
				<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.3 4.9 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.9a2 2 0 0 0-3.4 0Z" /></svg>
				<h3 id="diagnostics-heading">Review before using</h3>
			</div>
			<ul>
				{diagnostics.map(diagnostic => (
					<li key={`${diagnostic.server ?? 'root'}-${diagnostic.severity}-${diagnostic.message}`}>
						{diagnostic.server ? `${diagnostic.server}: ` : ''}
						{diagnostic.message}
					</li>
				))}
			</ul>
		</section>
	)
}
