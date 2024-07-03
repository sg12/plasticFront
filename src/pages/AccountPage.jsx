import { useEffect } from "react";
import { UserProvider } from "../context/UserContext";
import PersonalAccount from "../components/personalAccount/PersonalAccount";

const AccountPage = () => {
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
