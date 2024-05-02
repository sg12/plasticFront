import React from "react";
import { NavLink } from "react-router-dom";

import profile from "../../../assets/icons/profile.svg";
import favourites from "../../../assets/icons/favourites.svg";
import services from "../../../assets/icons/services.svg";
import clinics from "../../../assets/icons/clinics.svg";
import specialist from "../../../assets/icons/specialist.svg";
import appointment from "../../../assets/icons/appointment.svg";
import reviews from "../../../assets/icons/reviews.svg";
import setting from "../../../assets/icons/setting.svg";
import help from "../../../assets/icons/help.svg";
import support from "../../../assets/icons/support.svg";

import "./AsidePanel.scss";
import Divider from "../../UI/dividers/Divider";

const AsidePanel = ({ userType }) => {
  const getLinkData = () => {
    switch (userType) {
      case "client":
        return [
          { to: "profile", text: "Профиль (Клиент)", icon: profile },
          { to: "favourites", text: "Избранное", icon: favourites },
          {
            to: "appointment",
            text: "Записи на приём",
            icon: appointment,
            disabled: true,
          },
          { to: "reviews", text: "Отзывы", icon: reviews },
          { to: "settings", text: "Настройки", icon: setting },
          { to: "help", text: "Помощь", icon: help },
          { to: "support", text: "Поддержка", icon: support },
        ];
      case "surgeon":
        return [
          { to: "profile", text: "Профиль (Доктор)", icon: profile },
          { to: "clinic", text: "Клиника", icon: specialist },
          { to: "service", text: "Услуги", icon: services },
          {
            to: "appointment",
            text: "Записи на приём",
            icon: appointment,
            disabled: true,
          },
          { to: "reviews", text: "Отзывы пациентов", icon: reviews },
          { to: "settings", text: "Настройки", icon: setting },
          { to: "help", text: "Помощь", icon: help },
          { to: "support", text: "Поддержка", icon: support },
        ];
      case "clinic":
        return [
          { to: "profile", text: "Профиль (Клиника)", icon: profile },
          { to: "specialist", text: "Специалисты", icon: specialist },
          { to: "service", text: "Услуги", icon: services },
          {
            to: "appointment",
            text: "Записи на приём",
            icon: appointment,
            disabled: true,
          },
          { to: "reviews", text: "Отзывы пациентов", icon: reviews },
          { to: "settings", text: "Настройки", icon: setting },
          { to: "help", text: "Помощь", icon: help },
          { to: "support", text: "Поддержка", icon: support },
        ];
      default:
        return [
          {
            to: "undefined",
            text: "Неизвестный тип пользователя",
            icon: profile,
            disabled: true,
          },
        ];
    }
  };
  const linksData = getLinkData();

  return (
    <aside className="aside-panel">
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
          {((userType === "client" &&
            (index === 1 || index === 3 || index + 1 === 0)) ||
            (userType !== "client" &&
              (index === 1 || (index + 2) % 3 === 0))) &&
            index !== linksData.length - 1 && (
              <Divider opacity={.25} />
            )}
        </React.Fragment>
      ))}
    </aside>
  );
};

export default AsidePanel;
