import styles from './PrivacyBanner.module.css'

export function PrivacyBanner() {
	return (
		<section className={styles.root} aria-labelledby="privacy-title">
			<div className={styles.icon} aria-hidden="true">
				<svg viewBox="0 0 24 24">
					<path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z" />
					<path d="m9 12 2 2 4-5" />
				</svg>
			</div>
			<div>
				<p className={styles.kicker}>Local processing</p>
				<h2 id="privacy-title">Configuration data stays in this browser tab.</h2>
				<p>The application does not send configuration text to a server or save it after the tab is closed.</p>
			</div>
			<ul>
				<li>
					<span />
					No uploads
				</li>
				<li>
					<span />
					No accounts
				</li>
				<li>
					<span />
					No configuration storage
				</li>
			</ul>
		</section>
	)
}
