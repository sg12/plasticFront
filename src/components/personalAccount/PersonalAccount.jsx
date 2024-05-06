import { useLayoutEffect, useState } from "react";

import AsidePanel from "./asidePanel/AsidePanel";
import HeaderPanel from "./headerPanel/HeaderPanel";
import MainPanel from "./mainPanel/MainPanel";

import "./PersonalAccount.scss";
import "./root.scss";

import { useUser } from "../../context/UserContext";
// import UserGuide from "./userGuide/UserGuide";

const PersonalAccount = () => {
  const { userData } = useUser();
  const [isAsideVisible, setAsideVisible] = useState(true);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleResize = () => {
    if (window.innerWidth > 1440) {
      setAsideVisible(true);
    } else {
      setAsideVisible(false);
      setOverlayVisible(false);
    }
  };

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onToggleAside = () => {
    setAsideVisible(!isAsideVisible);
    setOverlayVisible(!isOverlayVisible);
  };

  return (
    <>
      <div className="grid-container">
        <header className="header-grid">
          <HeaderPanel userData={userData} onToggleAside={onToggleAside} />
        </header>
        <aside className={`aside-grid ${isAsideVisible ? "visible" : ""}`}>
          <AsidePanel onClick={onToggleAside} userType={userData?.user?.type} />
        </aside>
        <main className="main-grid">
          <MainPanel />
        </main>
        {/* <UserGuide /> */}
      </div>
      <div
        className={`overlay ${isOverlayVisible ? "visible" : ""}`}
        onClick={onToggleAside}
      ></div>
    </>
  );
};

export default PersonalAccount;
