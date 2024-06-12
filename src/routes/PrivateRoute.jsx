import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import Preloader from "../components/UI/preloader/Preloader";

const _apiBase = import.meta.env.VITE_API_URL;

const PrivateRoute = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const tokenHeader = "Token " + token;

    fetch(`${_apiBase}/account/`, {
      method: "GET",
      headers: {
        Authorization: tokenHeader,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка получения данных");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return <Navigate to="/enterPage" />;
  }

  return (
    <>
      <Preloader isLoading={loading} isDataLoaded={userData} />
      {userData && <Outlet />}
    </>
  );
};

export default PrivateRoute;
