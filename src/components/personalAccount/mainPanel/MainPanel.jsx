import "./MainPanel.scss";
import { Outlet, useLocation } from "react-router-dom";
import GreetingInfo from "./greetingInfo/GreetingInfo";

const MainPanel = () => {
  const location = useLocation();

  return (
    <main className="account__main">
      {location.pathname.startsWith("/account/") ? (
        <Outlet />
      ) : (
        <GreetingInfo />
      )}
    </main>
  );
};

export default MainPanel;
