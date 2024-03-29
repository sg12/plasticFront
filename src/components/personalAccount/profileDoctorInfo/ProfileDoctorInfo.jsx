import { useState } from "react";
import EditUser from "../editUser/EditUser";
import AlertModal from "../../UI/modals/alertModal/AlertModal";
import InDev from "../inDev/InDev";

// Выносим компонент для отображения информации о пользователе
const UserProfileDetails = ({ userData }) => (
  <div className="profile__details">
    <div className="profile__gender">
      <span className="profile__darkened">Пол: </span>
      {userData?.user?.gender || "Неизвестно"}
    </div>
    <div className="profile__birthdate">
      <span className="profile__darkened">Дата рождения: </span>
      {userData?.date_born || "Неизвестно"}
    </div>
    <div className="profile__address">
      <span className="profile__darkened">Адрес: </span>
      {userData?.user?.address || "Неизвестно"}
    </div>
    <div className="profile__site">
      <span className="profile__darkened">Официальный сайт: </span>
      {userData?.user?.site || "Неизвестно"}
    </div>
  </div>
);

// Выносим компонент для отображения футера профиля
const UserProfileFooter = ({ userData }) => (
  <div className="profile__footer">
    <InDev>
      <div className="profile__additionally">
        <div className="profile__licenses">
          <span className="profile__darkened">Лицензии и сертификаты</span>
          {userData?.licenses || "Неизвестно"}
          <button className="add" type="button">
            Добавить
          </button>
        </div>
        <hr className="profile__divider" />
        <div className="profile__education">
          <span className="profile__darkened">Образование</span>
          {userData?.education || "Неизвестно"}
          <button className="add" type="button">
            Добавить
          </button>
        </div>
        <hr className="profile__divider" />
        <div className="profile__qualification">
          <span className="profile__darkened">Повышение квалификации</span>
          {userData?.qualification || "Неизвестно"}
          <button className="add" type="button">
            Добавить
          </button>
        </div>
        <hr className="profile__divider" />
        <div className="profile__experience">
          <span className="profile__darkened">Опыт работы</span>
          {userData?.experience || "Неизвестно"}
          <button className="add" type="button">
            Добавить
          </button>
        </div>
      </div>
    </InDev>
  </div>
);

const UserProfileAction = ({ toggleEditingMode, handleDelete }) => (
  <div className="profile__action-button">
    <button type="button" className="edit" onClick={toggleEditingMode}>
      Редактировать профиль
    </button>
    <button type="button" className="delete" onClick={handleDelete}>
      Удалить учетную запись
    </button>
  </div>
);

const UserProfileHeader = ({ userData, imageSrc, handleFileChange }) => (
  <div className="profile__header">
    <div className="profile__user">
      <div className="profile__photo">
        <label htmlFor="uploadInput" className="profile__photo-label">
          <img
            src={userData?.user?.avatar || imageSrc}
            alt="user image"
            className="profile__photo-img"
          />
        </label>
        <input
          type="file"
          id="uploadInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="profile__details">
        <h3 className="profile__user-name">
          {userData?.user?.username || "Неизвестно"} (Doctor)
        </h3>
        <div className="profile__user-phone">
          <span className="profile__darkened">Телефон: </span>
          {userData?.user?.phone || "Неизвестно"}
        </div>
        <div className="profile__email">
          <span className="profile__darkened">Почта: </span>
          {userData?.user?.email || "Неизвестно"}
        </div>
      </div>
    </div>
    <div className="profile__identification">
      <div className="iden">
        <div className="iden__id">
          <span>Ваш ID:</span> {userData?.user?.id || "Неизвестно"}
        </div>
      </div>
    </div>
  </div>
);

const ProfileDoctorInfo = ({ userData }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleting");
  };

  return (
    <div className="profile">
      {userData && (
        <>
          <UserProfileHeader
            userData={userData}
            imageSrc={imageSrc}
            handleFileChange={handleFileChange}
          />
          <hr className="profile__divider" />
          {!isEditing && <UserProfileDetails userData={userData} />}
          {isEditing && (
            <EditUser
              userData={userData}
              toggleEditingMode={toggleEditingMode}
            />
          )}
          {!isEditing && (
            <>
              <UserProfileFooter userData={userData} />
              <hr className="profile__divider" />
              <UserProfileAction
                toggleEditingMode={toggleEditingMode}
                handleDelete={handleOpenModal}
              />
            </>
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
