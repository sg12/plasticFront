import { useLayoutEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { Slide, ToastContainer } from "react-toastify";
import { useWindowSize } from "@siberiacancode/reactuse";

import AsidePanel from "./asidePanel/AsidePanel";
import HeaderPanel from "./headerPanel/HeaderPanel";
import MainPanel from "./mainPanel/MainPanel";

import "./PersonalAccount.scss";
import "./root.scss";

const PersonalAccount = () => {
  const { userData } = useUser();
  const { width } = useWindowSize();
  const [isAsideVisible, setAsideVisible] = useState(true);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  useLayoutEffect(() => {
    if (width > 1440) {
      setAsideVisible(true);
    } else {
      setAsideVisible(false);
      setOverlayVisible(false);
    }
  }, [width]);

  const onToggleAside = () => {
    if (width < 1440) {
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
