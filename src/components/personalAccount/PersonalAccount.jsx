import { useEffect, useState } from "react";

import AsidePanel from "./asidePanel/AsidePanel";
import HeaderPanel from "./headerPanel/HeaderPanel";
import MainPanel from "./mainPanel/MainPanel";

import "./PersonalAccount.scss";
import "./root.scss";

import { useUser } from "../../context/UserContext";
// import UserGuide from "./userGuide/UserGuide";

const PersonalAccount = () => {
  const [isAsideVisible, setAsideVisible] = useState(window.innerWidth > 1440);
  const { userData } = useUser();

  return (
    <div className="grid-container">
      <header className="header-grid">
        <HeaderPanel
          userData={userData}
          onToggleAside={() => setAsideVisible(!isAsideVisible)}
        />
      </header>
      {isAsideVisible && (
        <aside className="aside-grid">
          <AsidePanel userType={userData?.user?.type} />
        </aside>
      )}
      <main className="main-grid">
        <MainPanel />
      </main>
      {/* <UserGuide /> */}
    </div>
  );
};

export default PersonalAccount;
