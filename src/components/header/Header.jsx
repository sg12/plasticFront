import { useState } from 'react';
import "./Header.scss";
import logo from '../../assets/imgs/logo.png';

const Header = () => {
    const [activeLink, setActiveLink] = useState(0);

    const handleLinkClick = (index, event) => {
        setActiveLink(index);
        event.preventDefault(); 
    };

    const links = [
        { text: 'ГЛАВНАЯ', href: '1' },
        { text: 'УСЛУГИ', href: '2' },
        { text: 'ВРАЧИ', href: '3' },
        { text: 'КЛИНИКИ', href: '4' },
        { text: 'ОТЗЫВЫ', href: '5' },
        { text: 'СТАТЬИ', href: '6' },
    ];

    return (
        <header className="header">
                <div className="header__logo">
                    <img className='logo__img' src={logo} alt="лого" />
                </div>
                <ul className="header__links">
                    {links.map((link, index) => (
                        <li key={index} className={index === activeLink ? 'active' : ''}>
                            <a href={link.href} onClick={(event) => handleLinkClick(index, event)}>
                                {link.text}
                            </a>
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