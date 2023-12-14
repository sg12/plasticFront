import { useState, useEffect } from "react";
import "./MainPanel.scss";
import { Outlet } from "react-router-dom";

const MainPanel = () => {
  const [loading, setLoading] = useState(true);

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
        <Outlet />
      )}
    </main>
  );
};

export default MainPanel;
