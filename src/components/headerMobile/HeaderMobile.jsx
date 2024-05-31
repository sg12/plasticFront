import './HeaderMobile.scss';

import { useState, useEffect, useRef } from 'react';
import Cookies from "js-cookie";
import { links } from '../header/Header';
import { categoriesData } from '../header/Header';

import logo from '../../assets/icons/logo.png';
import search from '../../assets/icons/search.png';

import MobileButton from '../UI/buttons/mobileButton/MobileButton';

import { Link, NavLink } from 'react-router-dom';

const HeaderMobile = () => {
    const [mobileNav, setMobileNav] = useState(false);
    const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);

    const menuRef = useRef(null);
    const servicesMenuRef = useRef(null);
    const searchInputRef = useRef(null);

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

    const handleCategoryClick = (event, title) => {
        event.stopPropagation();
        setOpenCategory(prevCategory => prevCategory === title.title ? null : title.title);
    };

    const handleSearchClick = () => {
        setMobileNav(false);

        const searchInput = document.querySelector('.search');
        if (searchInput) {
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            searchInput.focus({ preventScroll: true });
        }
    };

    const renderSubMenu = (subMenuItems) => {
        return (
            <div className="header-mobile__sub-menu">
                <ul className="header-mobile__sub-menu_ul">
                    {subMenuItems.map((item, index) => (
                        <li key={index} className="header-mobile__sub-menu_li">
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
                <MobileButton className="header-mobile__search" onClick={handleSearchClick}>
                    <img className="search__img" src={search} alt="поиск" />
                </MobileButton>
            </div>
            {mobileNav && <MobileNav />}
        </header>
    );

    function MobileNav() {
        return (
            <nav className='header-mobile__nav'>
                <ul className='header-mobile__list'>
                    <li className='header-mobile__link'>
                        {Cookies.get("token") ? (
                            <Link
                                to={"account/profile"}
                                className="header-mobile__button-item"
                            >
                                <p>ЛК</p>
                            </Link>
                        ) : (
                            <Link
                                to={"enterPage"}
                                className="header-mobile__button-item"
                            >
                                <p>Войти</p>
                            </Link>
                        )}
                    </li>
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
                                        <div className="header-mobile__services-menu">
                                            <ul>
                                                {categoriesData.map((title, index) => (
                                                    <li
                                                        className="header-mobile__services-menu__li"
                                                        key={index}
                                                        onClick={(event) => handleCategoryClick(event, title)}
                                                    >
                                                        {title.title}
                                                    </li>
                                                ))}
                                            </ul>
                                            {openCategory && (
                                                <div className="header-mobile__services-list">
                                                    <ul className="header-mobile__services-list__ul">
                                                        {categoriesData
                                                            .find((title) => title.title === openCategory)
                                                            .category.map((category, index) => (
                                                                <li key={index} className="header-mobile__services-list__li">
                                                                    <Link
                                                                        to={category.url}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {category.name}
                                                                    </Link>
                                                                    {category.items &&
                                                                        category.items.length > 0 &&
                                                                        renderSubMenu(category.items)
                                                                    }
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
