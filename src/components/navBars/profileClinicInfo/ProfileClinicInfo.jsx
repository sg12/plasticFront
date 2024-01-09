import { useState } from "react";

import qr from "../../../assets/imgs/qr-code.png";
import desc from "../../../assets/imgs/desc.svg";

import "../profileUser/ProfileUser.scss";
import EditUser from "../editUser/EditUser";

import EditPopup from "../showEditPopup/ShowEditPopup";
import DeletePopup from "../showDeletePopup/ShowDeletePopup";
import InDev from "../inDev/InDev";

const ProfileClinicInfo = ({ userData }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
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

  const handleSave = () => {
    // Логика для отправки данных на сервер

    // После успешного сохранения, отображаем всплывающее окно
    setShowEditPopup(true);
    toggleEditingMode(false);

    setTimeout(() => {
      setShowEditPopup(false);
    }, 3000);
  };

  const handleDelete = () => {
    // Логика для отправки данных на сервер

    setShowDeletePopup(true);
  };

  return (
    <div className="profile">
      {userData && (
        <>
          {/* Header */}
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
                  {userData.name || "Неизвестно"} (Clinic)
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
                {/* Rating Component */}
              </div>
            </div>
          </div>
          <hr className="profile__divider" />

          {/* MainInfo */}
          {!isEditing && (
            <div className="profile__main">
              <div className="profile__details">
                <div className="profile__site">
                  <span className="profile__darkened">Официальный сайт: </span>
                  {userData.site || "Неизвестно"}
                </div>
                <div className="profile__email">
                  <span className="profile__darkened">Почта: </span>
                  {userData.email || "Неизвестно"}
                </div>
                <div className="profile__address">
                  <span className="profile__darkened">Адрес: </span>
                  {userData.address.suite || "Неизвестно"}
                </div>
              </div>
            </div>
          )}
          <hr className="profile__divider" />

          {/* EditUser */}
          {isEditing && <EditUser userData={userData} />}

          {/* FooterInfo */}
          <div className="profile__footer">
            {!isEditing && (
              <>
                <InDev>
                  <div className="profile__additionally">
                    <div className="profile__licenses">
                      <span className="profile__darkened">
                        Лицензии и сертификаты
                      </span>
                      {userData.licenses || "Неизвестно"}
                      {/* <button className="add" type="button">
                        Добавить
                      </button> */}
                    </div>
                  </div>
                </InDev>
              </>
            )}
          </div>
          <hr className="profile__divider" />
          <div className="profile__action-button">
            {/* <EditPopup
              showEditPopup={notifications.length > 0}
              setShowEditPopup={() => setNotifications([])}
              notifications={notifications}
              setNotifications={setNotifications}
            /> */}
            <DeletePopup
              showDeletePopup={showDeletePopup}
              setShowDeletePopup={setShowDeletePopup}
            />
            {isEditing ? (
              <>
                <button type="button" className="save" onClick={handleSave}>
                  Сохранить
                </button>
                <button
                  type="button"
                  className="cancel"
                  onClick={toggleEditingMode}
                >
                  Отмена
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="edit"
                  onClick={toggleEditingMode}
                >
                  Редактировать профиль
                </button>
                <button type="button" className="delete" onClick={handleDelete}>
                  Удалить учетную запись
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileClinicInfo;
