import type { McpClientOption } from '../types'
import type { McpClientId } from '@/entities/mcpClient/model/mcpClient.types'
import styles from './ClientRoutePicker.module.css'

interface Props {
	clients: McpClientOption[]
	source: McpClientId
	target: McpClientId
	targets: McpClientId[]
	onChange: (clients: McpClientId[]) => void
}

export function TargetClientMenu({ clients, source, target, targets, onChange }: Props) {
	const available = clients.filter(client => client.id !== source)

	return (
		<details className={styles.targetMenu}>
			<summary aria-label="Choose output clients" data-count={targets.length}>
				<span>{targets.length === 1 ? 'Add outputs' : `${targets.length} outputs`}</span>
			</summary>
			<div className={styles.targetPanel}>
				<div className={styles.targetPanelHeader}>
					<strong>Output clients</strong>
					<span>
						{targets.length}
						{' '}
						selected
					</span>
				</div>
				<p className={styles.targetHelp}>With multiple clients, Preview shows one output. The ZIP includes them all.</p>
				<div className={styles.targetList}>
					{available.map(client => (
						<label key={client.id}>
							<input
								type="checkbox"
								checked={targets.includes(client.id)}
								disabled={targets.length === 1 && targets[0] === client.id}
								onChange={(event) => {
									onChange(event.currentTarget.checked
										? [...targets, client.id]
										: targets.filter(targetId => targetId !== client.id))
								}}
							/>
							<span>{client.name}</span>
						</label>
					))}
				</div>
				<div className={styles.targetActions}>
					<button type="button" onClick={() => onChange(available.map(client => client.id))}>Select all</button>
					<button type="button" onClick={() => onChange([target])}>
						Only
						{' '}
						{clients.find(client => client.id === target)?.name}
					</button>
				</div>
			</div>
		</details>
	)
}
