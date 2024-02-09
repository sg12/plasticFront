import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import ProfileClientInfo from "../profileClientInfo/ProfileClientInfo";
import ProfileClinicInfo from "../profileClinicInfo/ProfileClinicInfo";
import ProfileDoctorInfo from "../profileDoctorInfo/ProfileDoctorInfo";
import { Slide, ToastContainer } from "react-toastify";

const ProfileUser = () => {
  const { userData, userType } = useUser();
  console.log(userData, userType);

  let profileInfoComponent;
  if (userData) {
    switch (userType) {
      case "clients":
        profileInfoComponent = <ProfileClientInfo userData={userData} />;
        break;
      case "clinics":
        profileInfoComponent = <ProfileClinicInfo userData={userData} />;
        break;
      case "doctors":
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
      <ToastContainer
        stacked
        position="bottom-right"
        autoClose={5000}
        limit={3}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        transition={Slide}
      />
    </>
  );
};

export default ProfileUser;
