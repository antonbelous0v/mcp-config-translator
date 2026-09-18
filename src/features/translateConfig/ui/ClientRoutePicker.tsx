import type { ReactNode } from 'react'
import type { McpClientOption } from '../types'
import type { McpClientId } from '@/entities/mcpClient/model/mcpClient.types'
import { useState } from 'react'
import styles from './ClientRoutePicker.module.css'
import { TargetClientMenu } from './TargetClientMenu'

interface Props {
	clients: McpClientOption[]
	source: McpClientId
	target: McpClientId
	targets: McpClientId[]
	onSourceChange: (client: McpClientId) => void
	onTargetChange: (client: McpClientId) => void
	onTargetsChange: (clients: McpClientId[]) => void
	onSwap: () => void
}

export function ClientRoutePicker({ clients, source, target, targets, onSourceChange, onTargetChange, onTargetsChange, onSwap }: Props) {
	const [swapVersion, setSwapVersion] = useState(0)

	return (
		<div className={styles.root}>
			<ClientSelect clients={clients} label="From" value={source} excluded={target} onChange={onSourceChange} />
			<button
				className={styles.swap}
				type="button"
				aria-label="Swap source and target clients"
				title="Swap clients"
				onClick={() => {
					setSwapVersion(version => version + 1)
					onSwap()
				}}
			>
				<svg key={swapVersion} className={swapVersion ? styles.swapAnimated : undefined} aria-hidden="true" viewBox="0 0 24 24">
					<path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" />
				</svg>
			</button>
			<ClientSelect
				clients={clients}
				label={targets.length > 1 ? 'Preview' : 'To'}
				value={target}
				excluded={source}
				ids={targets.length > 1 ? targets : undefined}
				onChange={onTargetChange}
				after={(
					<TargetClientMenu clients={clients} source={source} target={target} targets={targets} onChange={onTargetsChange} />
				)}
			/>
		</div>
	)
}

function ClientSelect({
	clients,
	label,
	value,
	excluded,
	ids = clients.map(client => client.id),
	after,
	onChange,
}: {
	clients: McpClientOption[]
	label: string
	value: McpClientId
	excluded: McpClientId
	ids?: McpClientId[]
	after?: ReactNode
	onChange: (client: McpClientId) => void
}) {
	return (
		<label className={styles.field}>
			<span>{label}</span>
			<span className={styles.controlRow}>
				<span className={styles.selectWrap}>
					<select value={value} aria-label={`${label} client`} onChange={event => onChange(event.currentTarget.value as McpClientId)}>
						{ids.map(id => <option key={id} value={id} disabled={id === excluded}>{clients.find(client => client.id === id)?.name}</option>)}
					</select>
				</span>
				{after}
			</span>
		</label>
	)
}
