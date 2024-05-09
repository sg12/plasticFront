import './HeaderMobile.scss';

import logo from '../../assets/icons/logo.png';
import search from '../../assets/icons/search.png';

import { Link, useLocation, NavLink } from 'react-router-dom';

const HeaderMobile = () => {
	return (
		<header className="header-mobile">
			<div className="header-mobile__container container">
				<button className='header-mobile__hamburger'>
					<span></span>
					<span></span>
					<span></span>
				</button>
				<div className="header-mobile__logo">
					<NavLink to="/">
						{''}
						<img className="logo__img" src={logo} alt="лого" />
					</NavLink>
				</div>
				<button className="header-mobile__search">
					{''}
					<img className="search__img" src={search} alt="поиск" />
				</button>
			</div>
		</header>
	);
};

export default HeaderMobile;