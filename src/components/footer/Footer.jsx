import { useState } from 'react'

import { Link } from 'react-router-dom'

import './Footer.scss'

import logo from '../../assets/icons/logo.png'
import telegram from '../../assets/icons/telegram.png'
import instagram from '../../assets/icons/instagram.png'
import whatsapp from '../../assets/icons/whatsapp.png'

import { links } from '../header/Header'

const Footer = () => {
	const [activeLink, setActiveLink] = useState(0);

	const handleLinkClick = (index) => {
		setActiveLink(index);
	};

	return (
		<section className='footer'>
			<div className='footer__container container'>
				<div className='footer__box'>
					<div className='footer__item footer-item footer-item_logo'>
						<img className='footer-item__img' src={logo} alt="логотип" />
						<div className='footer-item__box'>
							<a href="#">
								<div className='footer-item__info'>Политика конфиденциальности</div>
							</a>
							<a href="#">
								<div className='footer-item__info'>Условия использования</div>
							</a>
							<div className='footer-item__text'>Все права защищены © 2023 Plastic Beauty </div>
						</div>
					</div>
					<div className='footer__item footer-item'>
						<h3 className='footer-item__title'>Навигация</h3>
						<nav className='footer-item__box'>
							{links.map((link, index) => (
								<li key={index} className='footer-item__link'>
									<Link className={`footer-item__a ${index === activeLink ? 'footer-item__a_active' : ''}`} to={link.to} onClick={(event) => handleLinkClick(index, event)}>
										{link.text}
									</Link>
								</li>
							))}
						</nav>
					</div>
					<div className='footer__item footer-item'>
						<h3 className='footer-item__title'>Контактная информация</h3>
						<div className='footer-item__box'>
							<p className='footer-item__text'>Горячая линия: 8 999 234 21 42</p>
							<p className='footer-item__text'>Email: plasticBeauty@mail.ru</p>
						</div>
					</div>
					<div className='footer__item footer-item'>
						<h3 className='footer-item__title'>Контактная информация</h3>
						<div className='footer-item__box footer-item__box_network'>
							<a href="#">
								<img src={telegram} alt="телеграмм" />
							</a>
							<a href="#">
								<img src={instagram} alt="инстаграм" />
							</a>
							<a href="#">
								<img src={whatsapp} alt="ватсап" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Footer