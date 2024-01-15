import React, { useState } from "react";
import qr from "../../../assets/imgs/qr-code.png";
import desc from "../../../assets/imgs/desc.svg";
import "../profileUser/ProfileUser.scss";
import EditUser from "../editUser/EditUser";
import DeletePopup from "../showDeletePopup/ShowDeletePopup";

// import CurrentTime from "../../UI/CurrentTime/CurrentTime";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

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
    {/* <DeletePopup /> */}
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
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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

  const handleDelete = () => {
    // Логика для удаления пользователя
    setShowDeletePopup(true);
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
                handleDelete={handleDelete}
              />
            </>
          )}
          <DeletePopup
            showDeletePopup={showDeletePopup}
            setShowDeletePopup={setShowDeletePopup}
          />
        </>
      )}
    </div>
  );
};

export default ProfileClientInfo;
