import './HeaderMobile.scss';

import { useState, useEffect } from 'react';

import { links } from '../header/Header';

import logo from '../../assets/icons/logo.png';
import search from '../../assets/icons/search.png';

import { Link, useLocation, NavLink } from 'react-router-dom';

const HeaderMobile = () => {

	const [mobileNav, setMobileNav] = useState(false);

	const [activeLink, setActiveLink] = useState(null);

	const onOpenMobileNav = () => {
		if (!mobileNav) {
			setMobileNav(true);
		} else if (mobileNav) {
			setMobileNav(false);
		}
	};

	const handleLinkClick = (index) => {
		setActiveLink(index);
	};

	const location = useLocation();

	useEffect(() => {
		const currentPath = window.location.pathname;
		const foundLinkIndex = links.findIndex((link) => link.to === currentPath);
		setActiveLink(foundLinkIndex === -1 ? null : foundLinkIndex);
	}, [location.pathname]);

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
								className={`header-mobile__a ${index === activeLink ? 'header-mobile__a_active' : ''}`}
								to={link.to}
								onClick={() => handleLinkClick(index)}
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