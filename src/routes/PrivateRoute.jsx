import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoute = () => {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/enterPage" />;
  }

  const tokenHeader = "Token " + token;

  fetch("http://localhost:8000/api/v1/account/", {
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
      console.log(data);
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });

  return <Outlet />;
};

export default PrivateRoute;
