import { useState, useEffect, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { getUserData } from "../../services/userData";
import Cookies from "js-cookie";
import "./Header.scss";
import logo from "../../assets/icons/logo.png";

export const links = [
  { text: "Главная", to: "" },
  { text: "Услуги", to: "" },
  { text: "Врачи", to: "doctors" },
  { text: "Клиники", to: "clinics" },
  { text: "Статьи", to: "articles" },
];
export const categoriesData = [
  {
    title: "Операция по коррекции лица и глаз",
    url: "/clinics",
    category: [
      {
        name: "Блефаропластика (глаза)",
        url: "/clinics",
        items: [
          { name: "Изменение формы и разреза глаз", url: "/clinics" },
          { name: "Устранение нависания века", url: "/clinics" },
          { name: 'Устранение "мешков" под глазами', url: "/clinics" },
          { name: "Коррекция возрастных изменений", url: "/clinics" },
        ],
      },
      {
        name: "Отопластика   (уши)",
        url: "/clinics",
        items: [
          { name: "Коррекция лопоухости", url: "/clinics" },
          { name: "Коррекция формы мочки уха", url: "/clinics" },
          { name: "Изменение формы ушей", url: "/clinics" },
        ],
      },
      {
        name: "Ментопластика (подбородок)",
        url: "/clinics",
        items: [
          { name: "Уменьшение подбородка", url: "/clinics" },
          { name: "Увеличение подбородка", url: "/clinics" },
          { name: "Коррекция формы подбородка", url: "/clinics" },
        ],
      },
      {
        name: "Хейлопластика (губы)",
        url: "/clinics",
        items: [
          { name: "Коррекция объема и формы губ", url: "/clinics" },
          { name: "Приподнятие уголков губ", url: "/clinics" },
          { name: "Омоложение области рта", url: "/clinics" },
        ],
      },
      {
        name: "Фронтопластика (лоб)",
        url: "/clinics",
        items: [
          { name: "Подтяжка бровей и лба", url: "/clinics" },
          { name: "Устранение птоза мягких тканей ", url: "/clinics" },
          { name: "Лифтинг лба и височной области", url: "/clinics" },
        ],
      },
      {
        name: "Малярпластика (скулы)",
        url: "/clinics",
        items: [
          { name: "Коррекция внешнего вида скул", url: "/clinics" },
          { name: "Реконструктивная пластика скул", url: "/clinics" },
          { name: "Коррекция асимметрии скул", url: "/clinics" },
        ],
      },
      {
        name: "Ринопластика (нос)",
        url: "/clinics",
        items: [
          { name: "Коррекция формы носа", url: "/clinics" },
          { name: "Удаление горбинки", url: "/clinics" },
          { name: "Выравнивание перегородки", url: "/clinics" },
        ],
      },
    ],
  },
];
const Header = () => {
  const [isServicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const userData = getUserData();

  const location = useLocation();
  const menuRef = useRef(null);


  const handleServicesClick = () => {
    setServicesMenuOpen(!isServicesMenuOpen);

    if (isServicesMenuOpen) {
      setActiveLink(null);
    } else {
      setActiveLink("Услуги");
    }

    setSelectedCategory(null);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link.text);

    if (link.text === "Услуги") {
      setActiveLink(null);
      setServicesMenuOpen(!isServicesMenuOpen);
    } else {
      setServicesMenuOpen(false);
    }

    setSelectedCategory(null);
  };

  const handleCategoryHover = (category) => {
    setSelectedCategory(category.title);
  };

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setServicesMenuOpen(false);
      setActiveLink(null);
      setSelectedCategory(null);
    }
  };

  useEffect(() => {
    const foundLink = links.find((link) => link.to === location.pathname);
    setActiveLink(foundLink ? foundLink.text : activeLink);
  }, [location.pathname]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
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
    <header className="header">
      <div className="header__container container">
        <div className="header__logo">
          <NavLink to="/">
            {" "}
            <img className="logo__img" src={logo} alt="лого" />
          </NavLink>
        </div>
        <ul className="header__links">
          {links.map((link, index) => (
            <li
              key={index}
              className={link.text === activeLink ? "active" : ""}
            >
              {link.text === "Услуги" ? (
                <div
                  onClick={handleServicesClick}
                  ref={menuRef}
                  className="services"
                >
                  <a>{link.text}</a>
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
                            <svg
                              width="12"
                              height="20"
                              viewBox="0 0 12 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 2L9.29289 9.29289C9.68342 9.68342 9.68342 10.3166 9.29289 10.7071L2 18"
                                stroke="black"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </svg>
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
                                  <Link
                                    to={category.url}
                                    style={{
                                      "font-weight": "800",
                                      color: "black",
                                    }}
                                  >
                                    {category.name}
                                  </Link>
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
                <NavLink to={link.to} onClick={() => handleLinkClick(link)}>
                  {link.text}
                </NavLink>
              )}
            </li>
          ))}
          <li>
            {Cookies.get("token") ? (
              <Link
                to={"account/profile"}
                className="header__button-item"
                style={{ color: "white" }}
              >
                <p>ЛК</p>
              </Link>
            ) : (
              <Link
                to={"enterPage"}
                className="header__button-item"
                style={{ color: "white" }}
              >
                <p>Войти</p>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
