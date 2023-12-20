import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import profile from "../../../assets/icons/profile.svg";
import favourites from "../../../assets/icons/favourites.svg";
import services from "../../../assets/icons/services.svg";
import clinics from "../../../assets/icons/clinics.svg";
import appointment from "../../../assets/icons/appointment.svg";
import reviews from "../../../assets/icons/reviews.svg";
import setting from "../../../assets/icons/setting.svg";
import help from "../../../assets/icons/help.svg";
import support from "../../../assets/icons/support.svg";

import "./AsidePanel.scss";

const AsidePanel = ({userType}) => {
  // const getLinkData = () => {
  //   switch (userType) {
  //     case "client":
  //       return [
  //         { to: "profile", text: "1", icon: profile },
  //         { to: "service", text: "Услуги", icon: services },
  //         { to: "clinic", text: "Клиники", icon: clinics },
  //         // ниже нет маршрутизации
  //         { to: "appointment", text: "Записи на приём", icon: appointment },
  //         { to: "reviews", text: "История записей", icon: reviews },
  //         { to: "setting", text: "Настройки", icon: setting },
  //         { to: "help", text: "Помощь", icon: help },
  //         { to: "support", text: "Поддержка", icon: support },
  //       ];
  //     case "doctor":
  //       return [
  //         { to: "profile", text: "2", icon: profile },
  //         { to: "service", text: "Услуги", icon: services },
  //         { to: "clinic", text: "Клиники", icon: clinics },
  //         // ниже нет маршрутизации
  //         { to: "appointment", text: "Записи на приём", icon: appointment },
  //         { to: "reviews", text: "История записей", icon: reviews },
  //         { to: "setting", text: "Настройки", icon: setting },
  //         { to: "help", text: "Помощь", icon: help },
  //         { to: "support", text: "Поддержка", icon: support },
  //       ];
  //     case "clinic":
  //       return [
  //         { to: "profile", text: "3", icon: profile },
  //         { to: "service", text: "Услуги", icon: services },
  //         { to: "clinic", text: "Клиники", icon: clinics },
  //         // ниже нет маршрутизации
  //         { to: "appointment", text: "Записи на приём", icon: appointment },
  //         { to: "reviews", text: "История записей", icon: reviews },
  //         { to: "setting", text: "Настройки", icon: setting },
  //         { to: "help", text: "Помощь", icon: help },
  //         { to: "support", text: "Поддержка", icon: support },
  //       ];
  //     default:
  //       return[];
  //   }
  // };
  // const linksData = getLinkData();

  // console.log("linksData", linksData[userType="client"])


  const linksData = [
    { to: "profile", text: "Профиль", icon: profile },
    { to: "favourites", text: "Избранное", icon: favourites },
    // ниже нет маршрутизации
    { to: "appointment", text: "Записи на приём", icon: appointment },
    { to: "reviews", text: "История записей", icon: reviews },
    { to: "settings", text: "Настройки", icon: setting },
    { to: "help", text: "Помощь", icon: help },
    { to: "support", text: "Поддержка", icon: support },
  ];

  return (
    <aside className="aside-panel">
      {linksData.map((link, index) => (
        <React.Fragment key={index}>
          <NavLink to={link.to} className="aside-panel__link" exact="true">
            <div className="aside-panel__icon">
              <img src={link.icon} alt="icon" />
            </div>
            <span className="aside-panel__text">{link.text}</span>
          </NavLink>
          {(index + 1) % 2 === 0 && index !== linksData.length - 1 && (
            <hr className="aside-panel__divider" />
          )}
        </React.Fragment>
      ))}
    </aside>
  );
};

export default AsidePanel;
