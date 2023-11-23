import { useState } from 'react';

import { Link } from 'react-router-dom';

import "./Header.scss";
import logo from '../../assets/icons/logo.png';

export const links = [
	{ text: 'Главная', to: '/' },
	{ text: 'Услуги', to: '/services' },
	{ text: 'Врачи', to: '/doctors' },
	{ text: 'Клиники', to: '/clinics' },
	{ text: 'Отзывы', to: '/reviews' },
	{ text: 'Статьи', to: '/articles' },
];

const Header = () => {
	const [activeLink, setActiveLink] = useState(0);

	const handleLinkClick = (index) => {
		setActiveLink(index);
	};

	return (
		<header className="header">
			<div className="header__logo">
				<Link to='/'><img className='logo__img' src={logo} alt="лого" /></Link>
			</div>
			<ul className="header__links">
				{links.map((link, index) => (
					<li key={index} className={index === activeLink ? 'active' : ''}>
						<Link to={link.to} onClick={(event) => handleLinkClick(index, event)}>
							{link.text}
						</Link>
					</li>
				))}
				<li>
					<div className="header__button-item">
						<p>Войти</p>
					</div>
				</li>
			</ul>
		</header>
	);
};

export default Header;