import { useUser } from "../../../context/UserContext";
import ProfileClientInfo from "../profileClientInfo/ProfileClientInfo";
import ProfileClinicInfo from "../profileClinicInfo/ProfileClinicInfo";
import ProfileDoctorInfo from "../profileDoctorInfo/ProfileDoctorInfo";

const ProfileUser = () => {
  const { userData, userType } = useUser();
  console.log(userData, userType);
  
  // Логика отображения компонента в зависимости от userType
  let profileInfoComponent;

  if (userData) {
    switch (userType) {
      case "client":
        profileInfoComponent = <ProfileClientInfo userData={userData} />;
        break;
      case "clinic":
        profileInfoComponent = <ProfileClinicInfo userData={userData} />;
        break;
      case "doctor":
        profileInfoComponent = <ProfileDoctorInfo userData={userData} />;
        break;
      default:
        profileInfoComponent = "Неизвестный тип пользователя";
    }
  }

  return (
    <div>
      {profileInfoComponent}
    </div>
  );
};

export default ProfileUser;
