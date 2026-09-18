import styles from './PageFooter.module.css'

export function PageFooter() {
	return (
		<footer className={styles.root}>
			<p>MCP Config Translator</p>
			<p>12 MCP clients supported</p>
		</footer>
	)
}
