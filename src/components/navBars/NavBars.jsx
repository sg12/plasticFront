import { useEffect, useState } from "react";

import AsidePanel from "./asidePanel/AsidePanel";
import HeaderPanel from "./headerPanel/HeaderPanel";
import MainPanel from "./mainPanel/MainPanel";

import "./NavBars.scss";
import "./root.scss";
import ProfileServices from "../../services/ProfileServices";

const NavBars = () => {
  const [isAsideVisible, setAsideVisible] = useState(window.innerWidth > 1440);
  const [userData, setUserData] = useState(null);
  const userType = "client"; // Заглушка для выбора типа пользователя

  const toggleAside = () => {
    setAsideVisible(!isAsideVisible);
    console.log("Active");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await ProfileServices.getUsers();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [setUserData]);

  return (
    <div className="grid-container">
      <header className="header-grid">
        <HeaderPanel userData={userData} onToggleAside={toggleAside} />
      </header>
      {isAsideVisible && (
        <aside className="aside-grid">
          <AsidePanel userType={userType} />
        </aside>
      )}
      <main className="main-grid">
        <MainPanel userData={userData} userType={userType} />
      </main>
    </div>
  );
};

export default NavBars;
