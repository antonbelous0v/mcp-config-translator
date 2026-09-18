import { TextInput } from '@mantine/core'
import styles from './catalogInput.component.module.css'

export function CatalogInput({ value, onChange }: { value: string, onChange: (value: string) => void }) {
	return (
		<TextInput
			classNames={{ input: styles.input, label: styles.label }}
			label="Explore the engineering defaults"
			placeholder="Search SSR, boundaries, DI, reset..."
			value={value}
			onChange={event => onChange(event.target.value)}
		/>
	)
}
