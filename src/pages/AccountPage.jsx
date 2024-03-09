// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import PersonalAccount from "../components/personalAccount/PersonalAccount";
import { UserProvider } from "../context/UserContext";

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
      <UserProvider>
        <PersonalAccount />
      </UserProvider>
    </>
  );
};

export default AccountPage;
