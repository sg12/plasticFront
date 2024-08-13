import React from "react";
import { NavLink } from "react-router-dom";
import getLinkData from "./getLinkData";

import "./AsidePanel.scss";

import Divider from "../../UI/dividers/Divider";

const AsidePanel = ({ userType, onClick }) => {
  const linksData = getLinkData(userType);

  return (
    <aside className="aside-panel" onClick={onClick}>
      {linksData.map((link, index) => (
        <React.Fragment key={index}>
          <NavLink
            to={link.to}
            className={`aside-panel__link ${link.disabled ? "disabled" : ""}`}
          >
            <div className="aside-panel__icon">
              <img src={link.icon} alt="icon" />
            </div>
            <span className="aside-panel__text">{link.text}</span>
          </NavLink>
          {/* {((userType === "client" &&
            (index === 1 || index === 3 || index + 1 === 0)) ||
            (userType !== "client" &&
              (index === 1 || (index + 2) % 3 === 0))) &&
            index !== linksData.length - 1 && <Divider />} */}
          {(index + 2) % 3 === 0 && index !== linksData.length - 1 && (
            <Divider />
          )}
        </React.Fragment>
      ))}
    </aside>
  );
};

export default AsidePanel;
