import { Container } from '@mantine/core'
import { Outlet } from 'react-router'
import { NavBar } from '@/widgets/NavBar'
import { navigationItems } from './navigation'

export function BaseLayout() {
	return (
		<>
			<NavBar items={navigationItems} />
			<Container component="main" id="main-content" tabIndex={-1} size="lg">
				<Outlet />
			</Container>
		</>
	)
}
