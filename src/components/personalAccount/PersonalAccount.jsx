import { useLayoutEffect, useState } from "react";

import AsidePanel from "./asidePanel/AsidePanel";
import HeaderPanel from "./headerPanel/HeaderPanel";
import MainPanel from "./mainPanel/MainPanel";

import "./PersonalAccount.scss";
import "./root.scss";

import { useUser } from "../../context/UserContext";
import { Slide, ToastContainer } from "react-toastify";
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
    if (window.innerWidth < 1440) {
      setAsideVisible(!isAsideVisible);
      setOverlayVisible(!isOverlayVisible);
    } else {
      setAsideVisible(isAsideVisible);
    }
  };

  return (
    <>
      <div className="grid-container">
        <header className="header-grid">
          <HeaderPanel userData={userData} onToggleAside={onToggleAside} />
        </header>
        <aside className={`aside-grid ${isAsideVisible ? "visible" : ""}`}>
          <AsidePanel onClick={onToggleAside} userType={userData?.role} />
        </aside>
        <main className="main-grid">
          <MainPanel />
        </main>
        {/* <UserGuide /> */}
      </div>

      {/* Overlay - При нажатии на бургер экран затемняется */}
      <div
        className={`overlay ${isOverlayVisible ? "visible" : ""}`}
        onClick={onToggleAside}
      ></div>

      <ToastContainer
        stacked
        position="bottom-right"
        autoClose={5000}
        limit={3}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        transition={Slide}
      />
    </>
  );
};

export default PersonalAccount;
