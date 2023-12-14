import React from "react";
import { Link } from "react-router-dom";

import women from "../../../assets/imgs/women.png";
import bell from "../../../assets/icons/bell.svg";
import logo from "../../../assets/icons/logoNew.svg";

import "./HeaderPanel.scss";

const HeaderPanel = ({ onToggleAside }) => {
  const burger = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="aside-panel__burger-icon"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5C2 4.44772 2.44772 4 3 4H21C21.5523 4 22 4.44772 22 5C22 5.55228 21.5523 6 21 6H3C2.44772 6 2 5.55228 2 5ZM3 10C2.44772 10 2 10.4477 2 11C2 11.5523 2.44772 12 3 12H21C21.5523 12 22 11.5523 22 11C22 10.4477 21.5523 10 21 10H3ZM3 16C2.44772 16 2 16.4477 2 17C2 17.5523 2.44772 18 3 18H21C21.5523 18 22 17.5523 22 17C22 16.4477 21.5523 16 21 16H3Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <header>
      <div className="account__header">
        <div className="header__logo-burger">
          <div className="header__burger-icon" onClick={onToggleAside}>
            {burger}
          </div>
          <div className="header__logo">
            <Link to={"/"}>
              <img src={logo} alt="logo" />
            </Link>
          </div>
        </div>
        <div className="header__account">
          <div className="header__notification">
            <img src={bell} alt="bell" />
          </div>
          <div className="header__user">
            <img className="user__photo" src={women} alt="photo" />
            <span>Светлана М.</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderPanel;
