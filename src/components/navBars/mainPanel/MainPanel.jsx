import { useState, useEffect } from "react";
import "./MainPanel.scss";
import { Outlet } from "react-router-dom";
import { UserProvider } from "../../../context/UserContext";

const MainPanel = ({ userType, userData }) => {
  const [loading, setLoading] = useState(true);
  // console.log(["UserData", userData, "UserType", userType]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 секунды

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="account_main">
      {loading ? (
        <div className="loader">Загрузка...</div>
      ) : (
        <UserProvider userData={userData} userType={userType}>
          <Outlet />
        </UserProvider>
      )}
    </main>
  );
};

export default MainPanel;
