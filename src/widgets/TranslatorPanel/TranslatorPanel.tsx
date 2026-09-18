import type { ReactNode } from 'react'
import styles from './TranslatorPanel.module.css'

export function TranslatorPanel({ children }: { children: ReactNode }) {
	return (
		<section className={styles.root} id="translator" aria-labelledby="translator-title">
			<h1 className={styles.title} id="translator-title">MCP Config Translator</h1>
			{children}
		</section>
	)
}
