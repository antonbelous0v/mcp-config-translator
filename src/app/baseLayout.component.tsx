import { Outlet } from 'react-router'
import styles from './baseLayout.component.module.css'

export function BaseLayout() {
	return (
		<main className={styles.main} id="main-content" tabIndex={-1}>
			<Outlet />
		</main>
	)
}
