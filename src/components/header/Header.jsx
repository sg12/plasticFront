// import { useState } from 'react';

import { Link } from 'react-router-dom';

import "./Header.scss";
import logo from '../../assets/imgs/logo.png';

const Header = () => {
	// const [activeLink, setActiveLink] = useState(0);

	// const handleLinkClick = (index, event) => {
	// 	setActiveLink(index);
	// 	event.preventDefault();
	// };

	// const links = [
	// 	{ text: 'Главная', to: '/' },
	// 	{ text: 'Услуги', to: '/services' },
	// 	{ text: 'Врачи', to: '/doctors' },
	// 	{ text: 'Клиники', to: '/clinics' },
	// 	{ text: 'Отзывы', to: '/reviews' },
	// 	{ text: 'Статьи', to: '/articles' },
	// ];

	return (
		<header className="header">
			<div className="header__logo">
				<img className='logo__img' src={logo} alt="лого" />
			</div>
			<ul className="header__links">
				{/* {links.map((link, index) => (
					<li key={index} className={index === activeLink ? 'active' : ''}>
						<Link to={link.to} onClick={(event) => handleLinkClick(index, event)}>
							{link.text}
						</Link>
					</li>
				))} */}
				<li>
					<Link to='/' >Главная</Link>
				</li>
				<li>
					<Link to='/services' >Услуги</Link>
				</li>
				<li>
					<Link to='/doctors' >Врачи</Link>
				</li>
				<li>
					<Link to='/clinics' >Клиники</Link>
				</li>
				<li>
					<Link to='/reviews' >Отзывы</Link>
				</li>
				<li>
					<Link to='/articles' >Статьи</Link>
				</li>
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