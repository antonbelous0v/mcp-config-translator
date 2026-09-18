import type { NavigationItem } from '@/shared/navigation.types'
import { Anchor, Box, Container, Group, Text } from '@mantine/core'
import { Link, NavLink } from 'react-router'
import { APP_CONFIG } from '@/shared/config'
import { SvgIcon } from '@/shared/ui/SvgIcon'
import styles from './NavBar.module.css'

export function NavBar({ items }: { items: NavigationItem[] }) {
	return (
		<Box component="header" className={styles.header}>
			<Container size="lg">
				<Group h={68} justify="space-between">
					<Anchor className={styles.brand} component={Link} to="/" underline="never">
						<Group component="span" gap="sm" wrap="nowrap">
							<span className={styles.mark}>
								<SvgIcon name="app" width={18} height={18} />
							</span>
							<Text fw={650} c="var(--color-text)" size="sm">{APP_CONFIG.name}</Text>
						</Group>
					</Anchor>

					<Group component="nav" aria-label="Primary navigation" gap="xs">
						{items.map(item => (
							<Anchor
								key={item.path}
								component={NavLink}
								to={item.path}
								end={item.path === '/'}
								underline="never"
								className={styles.link}
							>
								{item.label}
							</Anchor>
						))}
					</Group>
				</Group>
			</Container>
		</Box>
	)
}
