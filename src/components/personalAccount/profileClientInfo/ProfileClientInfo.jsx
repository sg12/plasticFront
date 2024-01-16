import React, { useState } from "react";
import qr from "../../../assets/imgs/qr-code.png";
import desc from "../../../assets/imgs/desc.svg";
import "../profileUser/ProfileUser.scss";
import EditUser from "../editUser/EditUser";
import AlertModal from "../../UI/modals/alertModal/AlertModal";


const UserProfileDetails = ({ userData }) => (
  <div className="profile__details">
    <div className="profile__gender">
      <span className="profile__darkened">Пол: </span>
      {userData.gender || "Неизвестно"}
    </div>
    <div className="profile__birthdate">
      <span className="profile__darkened">Дата рождения: </span>
      {userData.birthdate || "Неизвестно"}
    </div>
    <div className="profile__birthdate">
      <span className="profile__darkened">Почта: </span>
      {userData.email || "Неизвестно"}
    </div>
    <div className="profile__address">
      <span className="profile__darkened">Адрес: </span>
      {userData.address.suite || "Неизвестно"}
    </div>
    <hr className="profile__divider" />
  </div>
);

const UserProfileFooter = () => (
  <div className="profile__footer">
    <div className="profile__description">
      <img className="img" src={desc} alt="desc" />
      <div className="profile__description-text">
        <div className="text">
          Расскажите вашим близким и знакомым о нас, а мы поможем сэкономить их
          время на поиск нужного специалиста.
        </div>
        <div className="text">
          Количество пользователей, указавших Ваш ID при регистрации: 4
        </div>
        <div className="profile__discount">Персональная скидка 3%</div>
      </div>
    </div>
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
            src={userData.photo || imageSrc}
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
          {userData.name || "Неизвестно"} (Client)
        </h3>
        <p className="profile__user-phone">
          <span className="profile__darkened">Телефон: </span>
          {userData.phone || "Неизвестно"}
        </p>
      </div>
    </div>
    <div className="profile__identification">
      <div className="iden">
        <div className="iden__id">
          <span>Ваш ID:</span> {userData.id || "Неизвестно"}
        </div>
        <div className="iden__code">
          Код: {userData.address.zipcode || "Неизвестно"}
        </div>
      </div>
      <img
        src={qr}
        width="150"
        height="150"
        border="0"
        title="QR код"
        className="identification__qr-img"
      />
    </div>
  </div>
);

const ProfileClientInfo = ({ userData }) => {
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
              <UserProfileFooter />
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

export default ProfileClientInfo;
