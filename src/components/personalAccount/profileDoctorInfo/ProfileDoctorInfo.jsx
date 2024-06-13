import { useState } from "react";
import EditUser from "../editUser/EditUser";
import AlertModal from "../../UI/modals/alertModal/AlertModal";
import ProfileUserHeader from "../profileUser/ProfileUserHeader";
import ProfileUserAction from "../profileUser/ProfileUserAction";
import ProfileUserDetails from "../profileUser/ProfileUserDetails";
import ProfileUserFooter from "../profileUser/ProfileUserFooter";

const fieldsDetails = [
  { label: "Пол", value: "gender" },
  { label: "Дата рождения", value: "date_born" },
  { label: "Адрес", value: "address" },
  { label: "Официальный сайт", value: "site" },
];

const fieldsFooter = [
  { label: "Лицензии и сертификаты", value: "licenses" },
  { label: "Образование", value: "education" },
  { label: "Повышение квалификации", value: "qualification" },
  { label: "Опыт работы", value: "experience" },
];

const ProfileDoctorInfo = ({ userData }) => {
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
            role="Doctor"
          />
          <hr className="profile__divider" />
          {!isEditing && (
            <>
              <ProfileUserDetails fields={fieldsDetails} userData={userData} />
              <ProfileUserFooter fields={fieldsFooter} userData={userData} />
              <ProfileUserAction
                toggleEditingMode={() => setIsEditing((prev) => !prev)}
                handleDelete={() => setModalOpen(true)}
                isEditing={isEditing}
              />
            </>
          )}
          {isEditing && (
            <EditUser
              userData={userData}
              toggleEditingMode={() => setIsEditing((prev) => !prev)}
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

export default ProfileDoctorInfo;
