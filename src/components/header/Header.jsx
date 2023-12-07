import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/icons/logo.png';

export const links = [
	{ text: 'Главная', to: '/' },
	{ text: 'Услуги', to: '/services' },
	{ text: 'Врачи', to: '/doctors' },
	{ text: 'Клиники', to: '/clinics' },
	{ text: 'Акции', to: '/reviews' },
	{ text: 'Статьи', to: '/articles' },
];

const Header = () => {
	const [isServicesMenuOpen, setServicesMenuOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [activeLink, setActiveLink] = useState('Главная');

	const location = useLocation();

	const categoriesData = [
		{
			category: 'Операция по контурированию тела',
			liposuction: ['Липосакция',
				'Липосакция боков',
				'Липосакция галифе',
				'Липосакция галифе',
				'Липосакция голеней',
				'Липосакция живота',
				'Липосакция ног',
				'Липосакция подбородка',
				'Липосакция рук',
				'Липосакция шеи',
				'Липосакция ягодиц'
			],
			blepharoplasty: [
			],
			rest: [
				'Остальное',
				'Абдоминопластика',
				'Брахиопластика',
				'Глютеопластика',
				'Круропластика'
			],
		},
		{
			category: 'Операция по коррекции лица и глаз',
			liposuction: ['Липосакция',
				'Липосакция лица',
				' ',
				' ',
				' ',
				' ',
				
			],
			blepharoplasty: [
				'Блефаропластика',
				'Блефаропластика (верхняя)',
				'Блефаропластика (нижняя)',
				' ',
				' ',
				' ',
			],
			rest: [
				'Остальное',
				'Подтяжка лица',
				'Ментопластика',
				'Ринопластика',
				'Платизмопластика',
				'Отопластика',
				'Септопластика',
			],
		},
		{
			category: 'Операция по другим частям тела',

			liposuction: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				
			],
			blepharoplasty: [
			],
			rest: [
				'Остальное',
				'Лабиопластика',
				'Лечение гинекомастии',
				'Маммопластика',
				'Операция булхорн',
				'Подтяжка груди',
				'Удаление комков Биша',
				'Уменьшение груди',
				'Хейлопластика',
			],
		},
	];

	const handleServicesClick = () => {
		setServicesMenuOpen(!isServicesMenuOpen);
		setSelectedCategory(null);
		setActiveLink('Услуги');
	};

	const handleLinkClick = (link) => {
		setActiveLink(link.text);

		if (link.text === 'Услуги') {
			setServicesMenuOpen(!isServicesMenuOpen);
		} else {
			setServicesMenuOpen(false);
		}

		setSelectedCategory(null);
	};

	const handleCategoryHover = (category) => {
		setSelectedCategory(category);
	};

	useEffect(() => {
		const foundLink = links.find(link => link.to === location.pathname);
		setActiveLink(foundLink ? foundLink.text : 'Главная');
	}, [location.pathname]);

	return (
		<header className="header">
			<div className="header__logo">
				<Link to="/">
					{' '}
					<img className="logo__img" src={logo} alt="лого" />
				</Link>
			</div>
			<ul className="header__links">
				{links.map((link, index) => (
					<li key={index} className={link.text === activeLink ? 'active' : ''}>
						{link.text === 'Услуги' ? (
							<div onClick={handleServicesClick}>
								<a>{link.text}</a>
								{isServicesMenuOpen && (
									<div className="services-menu">
										<ul>
											{categoriesData.map((category, index) => (
												<li className="services-menu__li"
													key={index}
													onMouseEnter={() => handleCategoryHover(category.category)}
												>
													{category.category}
													<svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M2 2L9.29289 9.29289C9.68342 9.68342 9.68342 10.3166 9.29289 10.7071L2 18" stroke="black" stroke-width="3" stroke-linecap="round" />
													</svg>
												</li>
											))}
										</ul>
										{selectedCategory && (
											<div className="services-list">
												<h2>{selectedCategory}</h2>
												<ul key={index} className='services-list__ul'>
													{categoriesData
														.find((category) => category.category === selectedCategory)
														.liposuction.map((service, index) => (
															<li key={index} className='services-list__li'>
																{categoriesData.find((category) => category.category === selectedCategory).liposuction[index] && (
																	<Link to="*">
																		<p>{service}</p>
																	</Link>
																)}
																{categoriesData.find((category) => category.category === selectedCategory).blepharoplasty[index] && (
																	<Link to="*">
																		<p>{categoriesData.find((category) => category.category === selectedCategory).blepharoplasty[index]}</p>
																	</Link>
																)}
																{categoriesData.find((category) => category.category === selectedCategory).rest[index] && (
																	<Link to="*">
																		<p>{categoriesData.find((category) => category.category === selectedCategory).rest[index]}</p>
																	</Link>
																)}
															</li>
														))

														}
														
												</ul>
											</div>
										)}
									</div>
								)}
							</div>
						) : (
							<Link to={link.to} onClick={() => handleLinkClick(link)}>
								{link.text}
							</Link>
						)}
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
