import "./MainPanel.scss";
import { Outlet, useLocation } from "react-router-dom";
import GreetingInfo from "./greetingInfo/GreetingInfo";
import Divider from "../../UI/dividers/Divider";

const MainPanel = () => {
  const location = useLocation();
  return (
    <main className="main">
      {location.pathname.startsWith("/account/") ? (
        <>
          {/* <div className="main__header">Header</div>{" "}
          TODO: Сделать смену названия страницы через asidePanel 
          <Divider /> */}
          <div className="main__main">
            <Outlet />
          </div>
        </>
      ) : (
        <GreetingInfo />
      )}
    </main>
  );
};

export default MainPanel;
