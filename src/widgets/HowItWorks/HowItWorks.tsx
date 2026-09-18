import styles from './HowItWorks.module.css'

const steps = [
	['01', 'Validate input', 'Checks configuration syntax, server names, field types, URLs, and transports.'],
	['02', 'Convert fields', 'Converts command, args, env, cwd, URL, headers, and transport settings.'],
	['03', 'Report compatibility', 'Lists fields that are unsupported or represented differently by the target client.'],
] as const

export function HowItWorks() {
	return (
		<section className={styles.root} aria-labelledby="how-title">
			<div className={styles.intro}>
				<p className={styles.kicker}>Supported data</p>
				<h2 id="how-title">Configuration fields</h2>
				<p>Supports local process servers and remote HTTP or SSE servers across 12 MCP clients.</p>
			</div>
			<ol className={styles.steps}>
				{steps.map(([number, title, description]) => (
					<li key={number}>
						<span>{number}</span>
						<div>
							<h3>{title}</h3>
							<p>{description}</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	)
}
