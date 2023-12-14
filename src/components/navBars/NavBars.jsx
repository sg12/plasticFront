import { useState } from "react";

import AsidePanel from "./asidePanel/AsidePanel";
import HeaderPanel from "./headerPanel/HeaderPanel";
import MainPanel from "./mainPanel/MainPanel";

import "./NavBars.scss";

const NavBars = () => {
  const [isAsideVisible, setAsideVisible] = useState(window.innerWidth > 1440);

  const toggleAside = () => {
    setAsideVisible(!isAsideVisible);
    console.log('Active');
  };

  return (
    // <div className="wrapper">
    //   <div className="wrapper-left">
    //     <BurgerPanel />
    //     <AsidePanel />
    //   </div>
    //   <div className="wrapper-right">
    //     <HeaderPanel />
    //     <MainPanel />
    //   </div>
    // </div>

    <div className="grid-container">
      <header className="header-grid">
        <HeaderPanel onToggleAside={toggleAside} />
      </header>
      {isAsideVisible && (
        <aside className="aside-grid">
          <AsidePanel userType="client"/>
        </aside>
      )}
      <main className="main-grid">
        <MainPanel />
      </main>
    </div>
  );
};

export default NavBars;
