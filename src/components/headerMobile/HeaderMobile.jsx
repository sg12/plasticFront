import './HeaderMobile.scss';

import { useState } from 'react';

import { links } from '../header/Header';

import logo from '../../assets/icons/logo.png';
import search from '../../assets/icons/search.png';

import { Link, NavLink } from 'react-router-dom';

const HeaderMobile = () => {

	const [mobileNav, setMobileNav] = useState(false);

	const onOpenMobileNav = () => {
		if (!mobileNav) {
			setMobileNav(true);
		} else if (mobileNav) {
			setMobileNav(false);
		}
	};

	return (
		<header className="header-mobile">
			<div className="header-mobile__container container">
				<button className='header-mobile__hamburger' onClick={onOpenMobileNav}>
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
			{mobileNav && <MobileNav />}
		</header>
	);

	function MobileNav() {
		return (
			<nav className='header-mobile__nav'>
				<ul className='header-mobile__list'>
					{links.map((link, index) => (
						<li key={index} className='header-mobile__link'>
							<Link
								className={'header-mobile__a'}
								to={link.to}
							>
								{link.text}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		);
	}
};

export default HeaderMobile;