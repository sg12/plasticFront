import React, { useState } from "react";
import "../profileUser/ProfileUser.scss";
import EditUser from "../editUser/EditUser";
import AlertModal from "../../UI/modals/alertModal/AlertModal";
import ProfileUserHeader from "../profileUser/ProfileUserHeader";
import ProfileUserAction from "../profileUser/ProfileUserAction";
import ProfileUserDetails from "../profileUser/ProfileUserDetails";
import ProfileUserFooter from "../profileUser/ProfileUserFooter";

const fieldsDetails = [
  { label: "Официальный сайт", value: "site" },
  { label: "Почта", value: "email" },
  { label: "Адрес", value: "address" },
];

const fieldsFooter = [{ label: "Лицензии и сертификаты", value: "licenses" }];

const ProfileClinicInfo = ({ userData }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

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

  const toggleEditingMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleting");
  };

  return (
    <div className="profile">
      {userData && (
        <>
          <ProfileUserHeader
            userData={userData}
            imageSrc={imageSrc}
            handleFileChange={handleFileChange}
            role="Client"
          />
          <hr className="profile__divider" />
          {!isEditing && (
            <>
              <ProfileUserDetails fields={fieldsDetails} userData={userData} />
              <ProfileUserFooter fields={fieldsFooter} userData={userData} />
              <ProfileUserAction
                isEditing={isEditing}
                toggleEditingMode={toggleEditingMode}
                handleDelete={() => setModalOpen(true)}
              />
            </>
          )}
          {isEditing && (
            <EditUser
              userData={userData}
              toggleEditingMode={toggleEditingMode}
            />
          )}
          <AlertModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onAccept={handleDeleteAccount}
            title="Удалить учетную запись?"
            message="Удаление аккаунта приведет к безвозвратной потере всех связанных с
            ним данных."
          />
        </>
      )}
    </div>
  );
};

export default ProfileClinicInfo;
