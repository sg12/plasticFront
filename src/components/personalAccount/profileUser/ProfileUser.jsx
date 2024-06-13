import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import ProfileClientInfo from "../profileClientInfo/ProfileClientInfo";
import ProfileClinicInfo from "../profileClinicInfo/ProfileClinicInfo";
import ProfileDoctorInfo from "../profileDoctorInfo/ProfileDoctorInfo";

const ProfileUser = () => {
  const { userData } = useUser();
  console.log("ProfileUser", userData?.user?.type);

  let profileInfoComponent;
  if (userData) {
    switch (userData?.user?.type) {
      case "client":
        profileInfoComponent = <ProfileClientInfo userData={userData} />;
        break;
      case "clinic":
        profileInfoComponent = <ProfileClinicInfo userData={userData} />;
        break;
      case "surgeon":
        profileInfoComponent = <ProfileDoctorInfo userData={userData} />;
        break;
      default:
        profileInfoComponent = "Неизвестный тип пользователя";
    }
  } else {
    profileInfoComponent = "Данные о пользователе не получены. Сервер в спячке";
  }

  return (
    <>
      {profileInfoComponent}
    </>
  );
};

export default ProfileUser;
