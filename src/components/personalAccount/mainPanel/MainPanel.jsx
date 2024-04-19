import "./MainPanel.scss";
import { Outlet, useLocation } from "react-router-dom";
import GreetingInfo from "./greetingInfo/GreetingInfo";

const MainPanel = () => {
  const location = useLocation();
  const showProfileInfo = location.pathname.startsWith("/account/");

  return (
    <main className="account_main">
      {showProfileInfo ? <Outlet /> : <GreetingInfo />}
    </main>
  );
};

export default MainPanel;
