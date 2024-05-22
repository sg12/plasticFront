import { Outlet } from 'react-router-dom';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

const Layout = () => {
	return (
		<>
			<Header />
			<div style={{ minHeight: '60vh' }}>
				<Outlet />
			</div>
			<Footer />
		</>
	);
};

export default Layout;