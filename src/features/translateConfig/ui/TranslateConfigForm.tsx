import type { TranslateConfigViewModel } from '../types'
import { ClientRoutePicker } from './ClientRoutePicker'
import { ConfigEditor } from './ConfigEditor'
import styles from './TranslateConfigForm.module.css'
import { TranslationDiagnostics } from './TranslationDiagnostics'

export function TranslateConfigForm({ translator }: { translator: TranslateConfigViewModel }) {
	const sourceClient = translator.clients.find(client => client.id === translator.source)!
	const targetClient = translator.clients.find(client => client.id === translator.target)!

	return (
		<div className={styles.root}>
			<ClientRoutePicker
				clients={translator.clients}
				source={translator.source}
				target={translator.target}
				targets={translator.targets}
				onSourceChange={client => translator.changeSource(client)}
				onTargetChange={client => translator.changeTarget(client)}
				onTargetsChange={clients => translator.changeTargets(clients)}
				onSwap={() => translator.swap()}
			/>
			<div className={styles.editors}>
				<ConfigEditor
					label="Source config"
					path={sourceClient.path}
					value={translator.input}
					placeholder="Paste your agent configuration."
					onChange={value => translator.changeInput(value)}
					onKeyDown={(event) => {
						if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
							event.preventDefault()
							translator.run()
						}
					}}
					action={(
						<span className={styles.sourceActions}>
							<label className={styles.textButton}>
								Open file
								<input
									type="file"
									accept=".json,.jsonc,.toml,application/json,text/plain"
									onChange={(event) => {
										const file = event.currentTarget.files?.[0]
										if (file) {
											void file.text().then(value => translator.changeInput(value))
										}
										event.currentTarget.value = ''
									}}
								/>
							</label>
							<button className={styles.textButton} type="button" onClick={() => translator.loadExample()}>Load example</button>
						</span>
					)}
					footer={(
						<>
							<span aria-live="polite">{translator.sourceHint}</span>
							<button className={`${styles.textButton} ${styles.subtle}`} type="button" onClick={() => translator.clear()}>Clear</button>
						</>
					)}
				/>
				<ConfigEditor
					label={translator.targets.length > 1 ? 'Output preview' : 'Converted config'}
					path={targetClient.path}
					format={targetClient.format}
					value={translator.result?.output ?? ''}
					readOnly
					invalid={translator.hasError}
					placeholder="Your converted configuration will appear here."
					footer={(
						<>
							<span aria-live="polite">{translator.message}</span>
							<span className={styles.outputButtons}>
								<button className={styles.iconButton} type="button" disabled={!translator.result} onClick={() => translator.copy()}>
									<CopyIcon />
									{' '}
									{translator.copyLabel}
								</button>
								<button className={styles.iconButton} type="button" disabled={!translator.result} onClick={() => translator.download()}>
									<DownloadIcon />
									{' '}
									{translator.targets.length > 1 ? `Download ZIP (${translator.targets.length})` : 'Download'}
								</button>
							</span>
						</>
					)}
				/>
			</div>
			<div className={styles.convertRow}>
				<button className={styles.primaryButton} type="button" disabled={!translator.canConvert} onClick={() => translator.run()}>
					{translator.targets.length > 1 ? `Convert to ${translator.targets.length} clients` : 'Convert config'}
					<span key={translator.conversionVersion} className={translator.conversionVersion ? styles.convertMotion : undefined}>
						<ArrowIcon />
					</span>
				</button>
			</div>
			<TranslationDiagnostics diagnostics={translator.result?.diagnostics ?? []} />
		</div>
	)
}

function ArrowIcon() {
	return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m0 0-5-5m5 5-5 5" /></svg>
}

function CopyIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24">
			<rect x="8" y="8" width="11" height="11" rx="2" />
			<path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
		</svg>
	)
}

function DownloadIcon() {
	return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
}
