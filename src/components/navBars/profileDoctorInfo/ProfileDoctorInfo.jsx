import { useEffect, useState } from "react";

import qr from "../../../assets/imgs/qr-code.png";
import desc from "../../../assets/imgs/desc.svg";

import "./ProfileDoctorInfo.scss";
import EditUser from "../editUser/EditUser";
import ProfileServices from "../../../services/ProfileServices";

import EditPopup from "../showEditPopup/ShowEditPopup";
import DeletePopup from "../showDeletePopup/ShowDeletePopup";

const ProfileDoctorInfo = ({ userData }) => {
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
                    src={imageSrc}
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
                  {userData.name || "Неизвестно"} (Doctor)
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
          <hr className="profile__divider" />

          {/* MainInfo */}
          {!isEditing && (
            <div className="profile__main">
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
            </div>
          )}

          {/* EditUser */}
          {isEditing && <EditUser userData={userData} />}

          {/* FooterInfo */}
          <div className="profile__footer">
            {!isEditing && (
              <>
                <div className="profile__description">
                  <img className="img" src={desc} alt="desc" />
                  <div className="profile__description-text">
                    <div className="text">
                      Расскажите вашим близким и знакомым о нас, а мы поможем
                      сэкономить их время на поиск нужного специалиста.
                    </div>
                    <div className="text">
                      Количество пользователей, указавших Ваш ID при
                      регистрации: 4
                    </div>
                    <div className="profile__discount">
                      Персональная скидка 3%
                    </div>
                  </div>
                </div>
              </>
            )}
            <hr className="profile__divider" />
            <div className="profile__action-button">
              <EditPopup
                showEditPopup={showEditPopup}
                setShowEditPopup={setShowEditPopup}
              />
              <DeletePopup
                showDeletePopup={showDeletePopup}
                setShowDeletePopup={setShowDeletePopup}
              />
              {isEditing ? (
                <>
                  <input
                    formMethod="post"
                    type="submit"
                    value="Сохранить"
                    className="save"
                    onClick={handleSave}
                  />
                  <input
                    value="Отмена"
                    type="button"
                    className="cancel"
                    onClick={toggleEditingMode}
                  />
                </>
              ) : (
                <>
                  <input
                    value="Редактировать профиль"
                    type="button"
                    className="edit"
                    onClick={toggleEditingMode}
                  />
                  <input
                    value="Удалить учетную запись"
                    type="button"
                    className="delete"
                    onClick={handleDelete}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDoctorInfo;
