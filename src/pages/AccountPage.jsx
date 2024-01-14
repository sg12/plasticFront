// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import NavBars from "../components/navBars/NavBars";

const AccountPage = () => {
  // const { state } = useAuth();

  // if (!state.isAuthenticated) {
  //   return (
  //     <>
  //       <Navigate to="/enterPage" />
  //     </>
  //   );
  // }

  useEffect(() => {
    document.body.style.background = "#f2f2f2";
    return () => (document.body.style.background = "");
  }, []);

  return (
    <>
      <NavBars />
    </>
  );
};

export default AccountPage;
