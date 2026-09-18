import type { KeyboardEventHandler, ReactNode } from 'react'
import styles from './ConfigEditor.module.css'

interface Props {
	label: string
	path: string
	format?: string
	value: string
	readOnly?: boolean
	invalid?: boolean
	placeholder?: string
	footer: ReactNode
	action?: ReactNode
	onChange?: (value: string) => void
	onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>
}

export function ConfigEditor({
	label,
	path,
	format,
	value,
	readOnly,
	invalid,
	placeholder,
	footer,
	action,
	onChange,
	onKeyDown,
}: Props) {
	const headingId = `${readOnly ? 'output' : 'source'}-editor-heading`

	return (
		<section className={`${styles.root} ${readOnly ? styles.output : ''}`}>
			<header className={styles.header}>
				<div>
					<span className={styles.label} id={headingId}>{label}</span>
					<code>{path}</code>
				</div>
				{format ? <span className={styles.format}>{format}</span> : action}
			</header>
			<textarea
				value={value}
				aria-label={label}
				aria-invalid={invalid || undefined}
				readOnly={readOnly}
				spellCheck={false}
				autoCapitalize="off"
				autoComplete="off"
				placeholder={placeholder}
				onChange={event => onChange?.(event.currentTarget.value)}
				onKeyDown={onKeyDown}
			/>
			<footer className={styles.footer}>{footer}</footer>
		</section>
	)
}
