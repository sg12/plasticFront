import "../profileUser/ProfileUser.scss";
import { useUser } from "../../../context/UserContext";
import ProfileInfo from "../profileInfo/ProfileInfo";
import ProfileUserConfig from "./ProfileUser.cofig";

const ProfileUser = () => {
  const { userData } = useUser();

  const handleDeleteAccount = () => {
    console.log("Account deleting");
  };

  const userConfig = ProfileUserConfig(userData);

  return (
    <ProfileInfo
      userData={userData}
      handleDeleteAccount={handleDeleteAccount}
      fieldsDetails={userConfig.fieldsDetails}
      fieldsFooter={userConfig.fieldsFooter}
    />
  );
};

export default ProfileUser;
