// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
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
  return (
    <>
      <NavBars />
    </>
  );
};

export default AccountPage;
