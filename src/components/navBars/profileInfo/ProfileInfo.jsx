import { useEffect, useState } from "react";

import "./ProfileInfo.scss";
import ProfileServices from "../../../services/ProfileServices";
import HeaderInfo from "./headerInfo/HeaderInfo";
import MainInfo from "./mainInfo/MainInfo";
import FooterInfo from "./footerInfo/FooterInfo";
import EditUser from "../editUser/EditUser";

const ProfileInfo = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditingMode = () => {
    setIsEditing((prev) => !prev);
  };
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Вызов функции fetchUserData из предыдущего файла
    ProfileServices.fetchUserData()
      .then((data) => {
        setUsersData(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <div className="profile">
      {usersData && usersData.users && usersData.users.length > 0 && (
        <>
          <HeaderInfo
            imageSrc={imageSrc}
            user={usersData.users[2]}
            img={usersData.photo[2]}
            handleFileChange={handleFileChange}
          />
          <hr className="profile__divider" />
          {isEditing ? (
            <EditUser
              user={usersData.users[2]}
              onCancel={toggleEditingMode}
            />
          ) : (
            // В противном случае отображаем основную информацию
            <MainInfo user={usersData.users[2]} />
          )}
          <hr className="profile__divider" />
          <FooterInfo
            isEditing={isEditing}
            onEditClick={toggleEditingMode}
          />
        </>
      )}
    </div>
  );
  
};

export default ProfileInfo;
