import './HeaderMobile.scss';

import { useState, useEffect, useRef } from 'react';

import { links } from '../header/Header';
import { categoriesData } from '../header/Header';

import logo from '../../assets/icons/logo.png';
import search from '../../assets/icons/search.png';

import MobileButton from '../UI/buttons/mobileButton/MobileButton';

import { Link, NavLink } from 'react-router-dom';

const HeaderMobile = () => {
    const [mobileNav, setMobileNav] = useState(false);
    const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const menuRef = useRef(null);
    const servicesMenuRef = useRef(null);

    const onOpenMobileNav = () => {
        setMobileNav(prevState => !prevState);
    };

    const handleClickOutside = (event) => {
        const nav = document.querySelector('.header-mobile__nav');
        const button = document.querySelector('.header-mobile__hamburger');
        if (
            nav && !nav.contains(event.target) && 
            button && !button.contains(event.target) &&
            servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)
        ) {
            setMobileNav(false);
        }
    };

    useEffect(() => {
        if (mobileNav) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [mobileNav]);

    const handleServicesClick = (event) => {
        event.stopPropagation();
        setIsServicesMenuOpen(prevState => !prevState);
    };

    const handleCategoryHover = (title) => {
        setSelectedCategory(title.title);
    };

    const renderSubMenu = (subMenuItems) => {
        return (
            <div className="sub-menu">
                <ul className="sub-menu_ul">
                    {subMenuItems.map((item, index) => (
                        <li key={index} className="sub-menu_li">
                            <Link to={item.url} style={{ color: "black" }}>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <header className="header-mobile">
            <div className="header-mobile__container container">
                <MobileButton className='header-mobile__hamburger' onClick={onOpenMobileNav}>
                    <span></span>
                    <span></span>
                    <span></span>
                </MobileButton>
                <div className="header-mobile__logo">
                    <NavLink to="/">
                        <img className="logo__img" src={logo} alt="лого" />
                    </NavLink>
                </div>
                <NavLink to="/">
                    <MobileButton className="header-mobile__search">
                        <img className="search__img" src={search} alt="поиск" />
                    </MobileButton>
                </NavLink>
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
                            {link.text === "Услуги" ? (
                                <div
                                    onClick={handleServicesClick}
                                    ref={servicesMenuRef}
                                    className="services"
                                >
                                    <span>{link.text}</span>
                                    {isServicesMenuOpen && (
                                        <div className="services-menu">
                                            <ul>
                                                {categoriesData.map((title, index) => (
                                                    <li
                                                        className="services-menu__li"
                                                        key={index}
                                                        onMouseEnter={() => handleCategoryHover(title)}
                                                    >
                                                        {title.title}
                                                    </li>
                                                ))}
                                            </ul>
                                            {selectedCategory && (
                                                <div className="services-list">
                                                    <h2>{selectedCategory}</h2>
                                                    <ul className="services-list__ul">
                                                        {categoriesData
                                                            .find((title) => title.title === selectedCategory)
                                                            .category.map((category, index) => (
                                                                <li key={index} className="services-list__li">
                                                                    <NavLink
                                                                        to={category.url}
                                                                        style={{
                                                                            fontWeight: "800",
                                                                            color: "black",
                                                                        }}
                                                                    >
                                                                        {category.name}
                                                                    </NavLink>
                                                                    {category.items &&
                                                                        category.items.length > 0 &&
                                                                        renderSubMenu(category.items)}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    className={'header-mobile__a'}
                                    to={link.to}
                                >
                                    {link.text}
                                </Link>)}
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
};

export default HeaderMobile;
