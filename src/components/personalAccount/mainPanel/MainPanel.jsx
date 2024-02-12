import "./MainPanel.scss";
import { Outlet, useLocation } from "react-router-dom";
import { UserProvider } from "../../../context/UserContext";
import GreetingInfo from "./greetingInfo/GreetingInfo";

const MainPanel = ({ userType, userData }) => {
  const location = useLocation();
  const showProfileInfo = location.pathname.startsWith("/account/");

  return (
    <main className="account_main">
      <UserProvider userData={userData} userType={userType}>
        {showProfileInfo ? (
          <Outlet />
        ) : (
          <GreetingInfo />
        )}
      </UserProvider>
    </main>
  );
};

export default MainPanel;
